
const User = require("../models/User");
const bcrypt = require("bcryptjs");   //패스워드 암호화 라이브러리

const userController = {};

userController.createUser= async(req,res)=>{
try{
    let {email,password,name,level} = req.body;

    const user = await User.findOne({email});
    if(user){
        throw new Error("이미 존재하고있는 이메일입니다!!");
    }
    const salt = await bcrypt.genSaltSync(10);   //패스워드암화코드
    password = await bcrypt.hash(password,salt); //

    const newUser = new User({
    email,
    password,
    name,
    level: level ? level:"customer",
});
await newUser.save();

return res.status(200).json({status:"success"});

}catch(error){
    res.status(400).json({status: "fail", error:error.message});
}

};


userController.getUser = async(req,res)=>{
try{
    const {userId} = req;
    const user = await User.findById(userId);
    if(user){
        return res.status(200).json({status:"success",user});
    }
    throw new Error ("invalid token");
}catch(error){
    res.status(400).json({status: "error", error:error.message});
}
};



module.exports = userController;
