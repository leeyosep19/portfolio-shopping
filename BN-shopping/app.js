const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes");
const app = express();

require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());  //req.body 가 객체로 인식이 된다


app.use("/api",indexRouter);
// /api/user

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose
.connect(mongoURI,{useNewUrlparser:true})
.then(()=>console.log("mongoose connescted"))
.catch((error)=>console.log("DB connection fail"));


app.listen(process.env.PORT || 5000, ()=>{
    console.log("server on");
});
