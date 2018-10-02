const exp=require("express")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
const multer=require("multer")
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/")
    },
    filename:function(req,file,cb){
        cb(null, new Date()/10+ file.originalname);
    }
})
const upload=multer({storage: storage})

const Student=require("../../model/students")
const rout=exp()
rout.use(bodyparser.json())
mongoose.connect("mongodb://localhost:27017/mongoosedb").
then(()=>console.log("DB is Connected....")).
catch(err=>console.log(err))
rout.post("/",upload.single("imageName"),(req,res,next)=>{
    console.log(req.file)
   const student=new Student({
       _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        rollNo:req.body.rollNo,
        faculty:req.body.faculty
   })
   student
   .save()
   .then(result=>{
       res.status(200).json({
           message:"Student Registered..",
           NewStudents:student
        })
   })
   .catch(err=>{
       console.log(err)
        
       res.status(500).json({
           message:"Plz Enter Valid data..",
        //    Student:err
       })
   })
})
rout.get("/:sid",(req,res)=>{
       const id=req.params.sid;
    Student.findById(id).select("name rollNo faculty").
    then(result=>{
        if(result)
        {
            res.status(200).json({
               Student:result,
            })
        }
        else
        {
            res.status(404).json({
                message:"No Student Available"
            })
        }
    }).
    catch(err=> console.log(err))
})
rout.delete("/:sid",(req,res)=>{
    const id=req.params.sid;
    Student.
    remove({_id:id})
    .then(ress=>{
        res.status(200).json({
            message:"Deleted"
        })
    })
    .catch(err=>console.log(err))
})
rout.patch("/:sid",(req,res)=>{
    const id=req.params.sid
    const updateOps={}
    for(const ops of req.body)
    {
        updateOps[ops.opsName]=ops.value
    }
    Student.update({_id:id},{$set:updateOps}).exec().
    then(result=>{
        res.status(200).json({
            message:"Upadate Succsefully.."
        })
    }).
    catch(err=>console.log(err))
});
rout.get("/",(req,res)=>{
 Student.find().select("name rollNo faculty").
 then(result=>{
        const respons= {
              Student:result.map(doc=>{
                  return  {
                    name:doc.name,
                    rollNo:doc.rollNo,
                    faculty:doc.faculty,
                    request:{
                        type:"GET",
                        url:"http://localhost:1234/student/"+doc._id
                    }
                  }
              })
        }
         res.status(200).json(respons)        
 }).
 catch(err=> {
     console.log(err)
     res.status(404).json({
         message:"Data Not Found..."
     })
    })
})
module.exports=rout;
