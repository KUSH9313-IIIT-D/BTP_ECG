// Reference https://www.youtube.com/watch?v=L72fhGm1tfE
//https://blog.cloudflare.com/a-free-argo-tunnel-for-your-next-project/
// cloudflared tunnel localhost:8080
// npm run dev

const express = require('express');
const path = require('path');
const app = express();
var tools = require('./secure');


// Send Mail Message
var sendmail = require('./sendmail');
sendmail.sendOTP("anubha@iiitd.ac.in",between(1000,9999),"Anubha");


// Encryption 

var secure = tools.Encoder();
var keys = Object.keys(secure);
var en = encode("manish18156@iiitd.ac.in")
console.log(en);
console.log(decode(en));

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

function encode(data) {
  // put logic here to detect whether the specified origin is allowed.
  var key = keys[between(0,keys.length-1)]
  var encoded = "";
  for (var i = 0; i < data.length; i++){
      encoded+=secure[key][0][data[i]]
  }
  return key+encoded;
}

function decode(data) {
  // put logic here to detect whether the specified origin is allowed.
  var key = data.slice(0,7);
  data = data.slice(7);
  var decoded = "";
  for (var i = 0; i < data.length; i++){
      decoded+=secure[key][1][data[i]]
  }
  return decoded;
}


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


// Websocket
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const SPORT = process.env.PORT || 8888

server.listen(SPORT, function() {
    console.log((new Date()) + ` Server is listening on port ${SPORT}`);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  console.log(origin);
  return true;
}


// URL: ws://localhost:8888/
// Portocol: ecg-protocol

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    // ECG Connection
    
    var connection = request.accept('ecg-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var Data = JSON.parse(message.utf8Data);
            if(Data.Type=="Auth"){
              console.log('Received_Message: ' + Data);
              connection.sendUTF(message.utf8Data);
            }
            else if(Data.Type=="SendFile"){
              console.log('Received_Message: ' + Data);
              connection.sendUTF(`{"Test":25}`);
            }
            else if(Data.Type=="Process"){
              console.log('Received_Message: ' + Data);
              connection.sendUTF(Data);
            }
            else{
              console.log('Received_Message: ' + Data.Hello);
              connection.sendUTF(`Wrong Data Type.`);
            }
            
            
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    
});


// Port 
const PORT = process.env.PORT || 8080

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