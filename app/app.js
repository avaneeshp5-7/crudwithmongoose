const exp=require("express");
const app=exp();
const Student=require("../API/Routes/student")
app.use("/student",Student)
module.exports=app;
