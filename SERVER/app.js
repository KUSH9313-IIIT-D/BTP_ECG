// Reference https://www.youtube.com/watch?v=L72fhGm1tfE
//https://blog.cloudflare.com/a-free-argo-tunnel-for-your-next-project/
// cloudflared tunnel localhost:8080
// npm run dev

const express = require('express');

const path = require('path');

const app = express();

//    Home Page
app.use(express.static(path.join(__dirname,'venus')));

// demo
app.get('/demo',(req,res)=>{
  res.sendFile(path.join(__dirname,'./','demo.mp4'));
});

// APIs
app.get('/demo',(req,res)=>{
  res.send('Hello');
});

// Upload
var multer  =   require('multer');  
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
});  
var upload = multer({ storage : storage}).single('myfile');  
app.get('/upload',function(req,res){  
  res.sendFile(__dirname + "/upload.html");  
});
app.post('/uploadjavatpoint',function(req,res){  
  upload(req,res,function(err) {  
      if(err) {
          return res.end("Error uploading file.");  
      }  
      res.end("File is uploaded successfully!");  
  });  
});

// Port 
const PORT = process.env.PORT || 8080;

app.listen(PORT,() => console.log(`Server started on port ${PORT}`))

/*
'''
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080); 
*/