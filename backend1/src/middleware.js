const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } =require("./config");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("rec token from cookies")
    //console.log("Token:", token)
      try{
        const decoded= jwt.verify(token,JWT_PASSWORD)
        console.log({"Got the decoded thing with: ":decoded})
       if(decoded){
        req.userId=decoded.userId
        next();
      }
        else{

          return res.status(403).json({error:"Decoded body is incorrect !"})}
      } 
      catch(err){
        console.log("Auth failed because of the error: ",err)
        return res.status(403).json({message:"Authorization failed !"})
      }
}

module.exports = {
    authMiddleware,
};
