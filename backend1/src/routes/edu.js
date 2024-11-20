const express = require("express");
//require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require("../middleware");
const { JWT_PASSWORD } = require("../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs').promises;
const path = require('path');
const multer = require("multer");
// Retry configuration
const RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRY_DELAY = 10000; // 10 seconds
// Multer setup for file upload
const storage = multer.memoryStorage(); // Stores the file in memory as a buffer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
const tempDir = path.join(__dirname, 'temp');
fs.mkdir(tempDir, { recursive: true }).catch(console.error);

router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { originalname, mimetype, buffer } = req.file;
      const uploaderId = req.userId;

      // Store the PDF in MongoDB as a Blob
      const pdf = await prisma.pdf.create({
        data: {
          name: originalname,
          data: buffer, // Store the file content as Bytes (Blob)
          contentType: mimetype,
          uploaderId,
        },
      });

      res.status(201).json({ message: "PDF uploaded successfully!", pdf });
      console.log({ message: "PDF uploaded successfully!", pdf });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading PDF" });
    }
  }
);
router.get("/pdfs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the PDF from the database
    const pdf = await prisma.pdf.findUnique({
      where: { id },
    });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Set headers and serve the binary content
    res.setHeader("Content-Type", pdf.contentType); // Ensures it's recognized as a PDF
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.name}"`); // Prompts download
    console.log(pdf.data);
    res.send(pdf.data); // Send the binary data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching PDF" });
  }
});

router.get("/pdfs", async (req, res) => {
  try {
    const pdfs = await prisma.pdf.findMany({
      select: { id: true, name: true, createdAt: true },
    });

    res.status(200).json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching PDFs" });
  }
});
// Helper function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Exponential backoff function
const getRetryDelay = (attempt) => {
    return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
};
async function uploadFileWithRetry(fileManager, filePath, options, attempt = 1) {
    try {
        return await fileManager.uploadFile(filePath, options);
    } catch (error) {
        if (error.message.includes('model is overloaded') && attempt < RETRY_ATTEMPTS) {
            const retryDelay = getRetryDelay(attempt);
            console.log(`Attempt ${attempt} failed. Retrying in ${retryDelay/1000} seconds...`);
            await delay(retryDelay);
            return uploadFileWithRetry(fileManager, filePath, options, attempt + 1);
        }
        throw error;
    }
}
function parseGeminiResponse(responseText) {
    try {
        // Remove markdown code block markers if present
        const cleanedResponse = responseText
            .replace(/^```json\s*/, '')  // Remove ```json at the start
            .replace(/```\s*$/, '')      // Remove ``` at the end
            .trim();

        // Parse the cleaned JSON
        const parsedResponse = JSON.parse(cleanedResponse);

        // Validate the structure
        if (
            Array.isArray(parsedResponse) && 
            parsedResponse.every(item => 
                item.hasOwnProperty('serial') && 
                item.hasOwnProperty('content')
            )
        ) {
            return parsedResponse;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Parsing Error:', error);
        console.log('Original Response:', responseText);

        // Fallback parsing strategies
        try {
            // Try parsing without code block removal
            return JSON.parse(responseText);
        } catch (fallbackError) {
            // Last resort: return as single item array
            return [{
                serial: 1,
                content: responseText
            }];
        }
    }
}

router.post(
    "/uploadforeval",
    upload.single("pdf"),
    async (req, res) => {
        console.log("Reaching this route!")
        let tempFilePath = null;

      try {
        const { originalname, mimetype, buffer } = req.file;
        
        const tempFilePath = path.join(tempDir, `${Date.now()}-${originalname}`);
        
        // Write buffer to temporary file
        await fs.writeFile(tempFilePath, buffer);

        // Initialize GoogleGenerativeAI with your API_KEY.
        const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
        // Initialize GoogleAIFileManager with your API_KEY.
        const fileManager = new GoogleAIFileManager(process.env.API_KEY_GEMINI);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 4096,
                temperature: 0.4,
                topP: 1,
                topK: 32
            }
        });
        console.log("api key rec: ",process.env.API_KEY_GEMINI)

        // Upload the file and specify a display name.
        const uploadResponse = await uploadFileWithRetry(fileManager, tempFilePath, {
            mimeType: "application/pdf",
            displayName: originalname,
        });

         console.log(
             `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
         );
        const result = await model.generateContent([
            `Analyze the document and extract key information.
            
            Provide the output in the following JSON format:
            [
                {
                    "serial": 1,
                    "content": "Detailed information about the first key point"
                },
                ...
            ]
            
            Ensure:
            - Use clear, concise language
            - Number the serials sequentially
            - Wrap the response in JSON code block: \`\`\`json ... \`\`\``,
            {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
            },
        ]);

        const responseText = result.response.text();
         // Parse the response
         const parsedResponse = parseGeminiResponse(responseText);
         console.log("parsed result finally: ",parsedResponse)
        
        res.json({
            success: true,
            fileUri: uploadResponse.file.uri,
            displayName: uploadResponse.file.displayName
        });
      } catch (error) {
        console.error('Error processing PDF:', error);
        
        // Provide more specific error messages based on the error type
        let errorMessage = error.message;
        if (error.message.includes('model is overloaded')) {
            errorMessage = 'The service is currently experiencing high traffic. Please try again in a few minutes.';
        }
        
        res.status(error.message.includes('model is overloaded') ? 503 : 500).json({
            success: false,
            error: errorMessage
        });
      } finally {
        // Clean up temporary file
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (error) {
                console.error('Error cleaning up temporary file:', error);
            }
        }
    }
    }
  );

router.post("/signup", async (req, res) => {
  console.log("Reaching here");
  const body = req.body;
  try {
    const user = await prisma.eduSchema.create({
      data: {
        name: body.username,
        lastname: body.lastname,
        email: body.email,
        password: body.password,
      },
    });
    const userId = user.id;
    const token = jwt.sign(userId, JWT_PASSWORD);
    res.cookie("token", token);
    res.json({ message: "signup successful !" });
  } catch (e) {
    console.log("Got the error: ", e);
    return res.status(403).json({
      message: "Got error while signing up",
    });
  }
});
router.post("/signin", async (req, res) => {
  console.log("Reaching here");
  const body = req.body;
  try {
    const founduser = await prisma.eduSchema.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    console.log("Got the user: ", founduser);
    if (founduser) {
      const token = jwt.sign({ userId: founduser.id }, JWT_PASSWORD);
      res.cookie("token", token);
      res.json({ message: "signup successful !" });
    } else {
      res.status(411).json({ message: "User not found !" });
    }
  } catch (e) {
    console.log("Got the error: ", e);
    return res.status(403).json({
      message: "Got error while signing in",
    });
  }
});

module.exports = router;
