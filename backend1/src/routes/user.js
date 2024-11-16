const express = require("express");
//require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const jwt=require("jsonwebtoken")
const router=express.Router()
const prisma=new PrismaClient();
const { authMiddleware } =require('../middleware');
const { JWT_PASSWORD } = require("../config");

//for frontend using cookies
// await axios.post(`${BACKEND_URL}/signin`, {
//     username,
//     password
// }, {
//     withCredentials: true,
// });
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


module.exports = router;
