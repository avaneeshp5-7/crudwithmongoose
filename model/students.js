const mongoose=require("mongoose")
const StudentSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        unique: true
    },
    rollNo:{
        type:Number,
        required:true,
        unique: true
    },
    faculty:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Student",StudentSchema);