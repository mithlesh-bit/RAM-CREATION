const mongoose=require('mongoose')

const db=mongoose.connect(process.env.dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  }).then(()=>{
    console.log("database connected");
  }).catch((error)=>{
    console.log("failed to connect db");
  });

module.exports=db
