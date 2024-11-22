const express = require("express");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const jwt=require("jsonwebtoken")
const router=express.Router()
const prisma=new PrismaClient();
const { authMiddleware } =require('../middleware');
const { JWT_PASSWORD } = require("../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs').promises;
const path = require('path');
const multer = require("multer");
const { cleanupTempFile, cleanupTempDirectory } = require('../utilityfunction/clenupfunction');
const { parseGeminiResponse, processMultipleDocuments } = require('../utilityfunction/aidinupload');
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
const questionDir = path.join(__dirname,'questions');
fs.mkdir(questionDir,{recursive:true}).catch(console.error);

router.post('/signup', async(req,res)=>{
    console.log("Reaching here")
  const body= req.body;
  try{
      const user=await prisma.userSchema.create({
          data:{
              name:body.username,
              lastname:body.lastname,
              email:body.email,
              password:body.password,
          }
      });
      const userId=user.id;
      const token=jwt.sign(userId,JWT_PASSWORD);
      res.cookie("token", token);
      res.json({message:"signup successful !"})
  }catch(e){
      console.log("Got the error: ",e);
      return res.status(403).json({
          message:"Got error while signing up"
      });
  }
})
router.post('/signin',async (req,res)=>{
    console.log("Reaching here")
  const body=req.body;
  try{
      const founduser=await prisma.userSchema.findFirst({
          where:{
              email:body.email,
              password:body.password
          }
      })
      console.log("Got the user: ",founduser)
      if(founduser){
          const token=jwt.sign({userId:founduser.id},JWT_PASSWORD);
      res.cookie("token", token);
      res.json({message:"signup successful !"})
      }else{
        res.status(411).json({message:"User not found !"})
      }
  }catch(e){
      console.log("Got the error: ",e);
      return res.status(403).json({
          message:"Got error while signing in"
      });
  }
})
router.post('/profilesetup', authMiddleware ,async (req,res)=>{

      const body = req.body;
      const userId = req.userId
      //console.log("userId rec. ",userId)
      try{
        const userdetail = await prisma.userDetail.upsert({
            where:{userId},
            update:{
                userId:userId,
              lat:body.lat,
              long:body.long,
              fieldofinterest:body.fieldofinterest,
              gender:body.gender,
              age:Number(body.age),
              phone:Number(body.phone),
              state:body.state,
              currentstd:body.currentstd,
              socialmedia: { instagram: body.instagram, twitter: body.twitter, linkedin: body.linkedin }
            },
          create:{
              userId:userId,
              lat:body.lat,
              long:body.long,
              fieldofinterest:body.fieldofinterest,
              gender:body.gender,
              age:Number(body.age),
              phone:Number(body.phone),
              state:body.state,
              currentstd:body.currentstd,
              socialmedia: { instagram: body.instagram, twitter: body.twitter, linkedin: body.linkedin }
          }
        })
        res.status(200).json({message:"Profile created successfully"})
      }catch(error){
        console.log("Got the error: ",error);
        res.status(411).json({error:"Failed to setup the profile"});
      }
})
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

router.post(
    "/uploadforevalv1",
    upload.single("pdf"),
    async (req, res) => {
        console.log("User uploaded his answer and they will be sent to gemini with set of questions!")
        const tempFiles = [];
        const fileUris = [];

      try {
        const { originalname, mimetype, buffer } = req.file;
        const body = req.body;
        const tempFilePath = path.join(tempDir, `${Date.now()}-${originalname}`);
        
        // Write buffer to temporary file
        await fs.writeFile(tempFilePath, buffer);
        const questionFile = await prisma.questionPdf.findUnique({
          where:{
            subject: body.subject,
            level: body.level
          }
        })
        const questionFilePath = path.join(questionDir,`${Date.now()}-${questionFile.name}`);
        await fs.writeFile(questionFilePath,questionFile.data);
         // Clean up old files first
         await cleanupTempDirectory(tempDir);
         await cleanupTempDirectory(questionDir);
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

        // Upload the file and specify a display name.
        const uploadResponse = await uploadFileWithRetry(fileManager,tempFilePath, {
            mimeType: "application/pdf",
            displayName: file.originalname
        });
        tempFiles.push(tempFilePath);
        fileUris.push(uploadResponse.file.uri);

        const uploadQuestions = await fileManager.uploadFileWithRetry(fileManager,questionFilePath,{
            mimeType: "application/pdf",
            displayName: questionFile.name
        });
        tempFiles.push(questionFilePath);
        fileUris.push(uploadQuestions.file.uri);

        const result = await processMultipleDocuments(fileUris);

        const responseText = result.response.text();
         console.log("result from gemini: ",responseText)
        
       res.json({
            success: true,
            data: result
        });
      } catch (error) {
        console.error('Error in upload-multiple:', error);
         // Attempt cleanup even in case of error
         if (tempFilePath) {
          try {
              await cleanupTempFile(tempFilePath);
          } catch (cleanupError) {
              console.error('Failed to cleanup after error:', cleanupError);
          }
      }
        res.status(error.message.includes('model is overloaded') ? 503 : 500).json({
            success: false,
            error: errorMessage
        });
      } finally {
        // Clean up temporary file
        for (const tempFile of tempFiles) {
            try {
                if (await fileExists(tempFile)) {
                    await fs.unlink(tempFile);
                    console.log(`Cleaned up temp file: ${tempFile}`);
                }
            } catch (error) {
                console.error(`Error cleaning up ${tempFile}:`, error);
            }
        }
    }
    }
  );
// Scheduled cleanup (run every hour)
setInterval(async () => {
  const tempDir = path.join(__dirname, '../temp');
  try {
      await cleanupTempDirectory(tempDir);
  } catch (error) {
      console.error('Scheduled cleanup failed:', error);
  }
}, 60 * 60 * 1000); // Run every hour


module.exports = router;
