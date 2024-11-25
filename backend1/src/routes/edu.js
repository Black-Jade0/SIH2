const express = require("express");
//require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require("../middleware");
const { JWT_PASSWORD } = require("../config");
const multer = require("multer");
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

router.post(
  "/uploadquestions",
  authMiddleware,
  upload.single("pdf"),
  async (req, res) => {
    //route for uploading questions to database 
    try {
      const { originalname, mimetype, buffer } = req.file;
      const uploaderId = req.userId;
      console.log("rec. file ",req.body)
      const body = JSON.parse(req.body.infoFile);
      // Store the PDF in MongoDB as a Blob
      const pdf = await prisma.questionPdf.create({
        data: {
          name: originalname,
          data: buffer, // Store the file content as Bytes (Blob)
          contentType: mimetype,
          uploaderId,
          subject: body.subject,
          level: body.level
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
    const pdf = await prisma.questionPdf.findUnique({
      where: { id },
    });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Set headers and serve the binary content
    res.setHeader("Content-Type", pdf.contentType); // Ensures it's recognized as a PDF
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.name}"`); // Prompts download
    console.log(pdf.data);
    res.send({data:pdf.data,subject:pdf.subject,level:pdf.level}); // Send the binary data, subject and level of pdf
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching PDF" });
  }
});

router.get("/pdfs", async (req, res) => {
  try {
    const pdfs = await prisma.questionPdf.findMany({
      select: { id: true, name: true, createdAt: true },
    });

    res.status(200).json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching PDFs" });
  }
});

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
