const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");   //패스워드 암호화 라이브러리
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//참조https://www.npmjs.com/package/google-auth-library  설치 npm install google-auth-library
const {OAuth2Client} = require('google-auth-library');
const { status } = require("express/lib/response");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController= {};

authController.loginWithEmail=async(req,res)=>{
    try{
        const {email,password} = req.body;
        let user = await User.findOne({email});
        if(user){
            const inMatch = await bcrypt.compare(password,user.password);
            if(inMatch){
                //token
                const token = await user.generateToken();
                return res.status (200).json({status:"success",user,token});
            }
        }
        throw new Error ("invalid email or password");
    }catch(error){
        res.status (400).json({status:"fail",error:error.message});
    }
};


authController.loginWithGoogle = async(req,res)=>{
    try{
        const {token} = req.body;
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken:token,
            audience:GOOGLE_CLIENT_ID
        });
        const {email,name} = ticket.getPayload();
        let user = await User.findOne({email})
        if(!user){
            //유저를 새로생성
            const randompassword = ""+Math.floor(Math.random()*100000000);
            const salt = await bcrypt.genSalt(10);
            const newPassword =await bcrypt.hash(randompassword,salt);
            user = new User({
                name,
                email,
                password:newPassword
            })
            await user.save();
        }
        // 토큰 발행 리턴
        const sessionToken = await user.generateToken();
        res.status(200).json({status:"success",user,token:sessionToken});


    }catch(error){
        res.status (400).json({status:"fail",error:error.message});
    }
};


//인증 미들웨어
// authController.authenticate = async (req, res, next) => {
//     try {
//         const tokenString = req.headers.authorization;
//         if (!tokenString) throw new Error("Token not found");
        
//         const token = tokenString.replace("Bearer ", "");
//         const decoded = jwt.verify(token, JWT_SECRET_KEY);
//         req.userId = decoded._id;

//         console.log("authenticate ok");
//         next();
//     } catch (error) {
//         res.status(400).json({ status: "fail", error: error.message });
//     }
// };
authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) throw new Error("Token not found");
        
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY,(error,payload)=>{
            if(error) throw new Error("invalid token");
            req.userId = payload._id;
            
        });

        console.log("authenticate ok");
        next();
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
};



// 관리자 권한 체크
authController.checkAdminPermission =async(req,res,next)=>{       //admin 체크
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(user.level !== "admin")
            throw new Error("no permission");
        console.log("checkAdminPermission ok")

        next();
    }catch(error){
        res.status (400).json({status:"fail",error:error.message});
    }
};


module.exports = authController;