const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors=require("cors");
const {
  GridFsStorage
} = require("multer-gridfs-storage");
var crypto = require('crypto');
var path = require('path');


const mongouri = 'mongodb+srv://Sushant:sushant@cluster1.amdqknu.mongodb.net/pdf_storageretr?retryWrites=true&w=majority';
try {
  mongoose.connect(mongouri);
} catch (error) {
  handleError(error);
}
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  console.log(bucket);
});

app.use(express);
app.use(cors);
app.use(express.urlencoded({
  extended: false
}));

const storage = new GridFsStorage({
  url: mongouri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket"
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({
  storage
});

app.post("/upload", upload.single("pdf"), (req, res) => {
  res.status(200)
    .send("File uploaded successfully");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Application live on localhost:${PORT}`);
});