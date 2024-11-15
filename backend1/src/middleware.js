const jwt = require("jsonwebtoken");
//const { JWT_PASSWORD } =require("../config");

const authMiddleware = async (req, res, next) => {
    const authheader = req.headers.authorization;
    //console.log({ "authheader is: ": authheader });

    if (!authheader || !authheader.startsWith("Bearer ")) {
      //console.log("Getting here !")
        return res.status(403).json({error:"Got this error why but"});
    }
    const token=authheader.split(' ')[1]
    //console.log("Token:", token)
      try{
        const decoded= jwt.verify(token,process.env.JWT_PASSWORD)
        // console.log({"Got the decoded thing with: ":decoded})
        //console.log({"Got the userId thing with: ":decoded})
       if(decoded){
        req.userId=decoded
        next();
      }
        else{return res.status(403).json({error:"Decoded body is incorrect !"})}
      } 
      catch(err){
        console.log({"authheader is: ":authheader,
          message2:"Got the error",err}
        )
        return res.status(403).json({message:"Authorization failed !"})
      }
}

module.exports = {
    authMiddleware,
};
