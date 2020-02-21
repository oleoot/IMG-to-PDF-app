const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const {createWorker} = require("tesseract.js");
const worker = createWorker({logger: m => console.log(m)});


const storage = multer.diskStorage({
 destination: (req,file,cb) =>{
  cb(null, "./uploads")
 },
 filename: (req, file, cb) =>{
    cb(null, file.originalname);
 }
});

const upload = multer({storage: storage}).single("avatar");

app.set("view engine", "ejs");

// ROUTES
app.get("/",(req,res) =>{
   res.render("index");
});


app.post("/upload", (req,res) =>{
upload(req,res,err =>{
fs.readFile(`./uploads/${req.file.originalname}`, (err, data)=>{
if(err) return console.log("This is your error", err);

worker
.recognize(data,"eng", {tessjs_create_pdf:"1" })
// .progress(progress=>{
//  console.log(progress);
// })
.then(result=>{
 res.redirect('./download');
})
.finally(()=>worker.terminate());
});
});
});


app.get("./download", (req,res)=>{
const file = `${__dirname}/tesseract.js-ocrresult.pdf`;
res.download(file);
});

// Start up our server
const PORT = 1000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey im running on port ${PORT}`))
