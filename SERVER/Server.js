const express = require('express')
const app = express()
const path = require('path');
const server = require('http').createServer(app);
const WebSocket = require('ws');
const fs = require('fs')
var cron = require('node-cron');
var sendmail = require('./ServerFiles/sendmail');
const {spawn} = require('child_process');


/*
		Uploads
*/
app.post('/upload',(req,res,next)=>{
	console.log(req.body);
	var readFile = Buffer.from(req.body.file,"base64");
	fsc.writeFileSync(req.body.name,readFile,"utf8");
	res.send('{"message":"Done"}');
});

/*             WebSocket                             */

// File Indexing
var assignIndex=0;

//
const wss = new WebSocket.Server({ server:server });
var ValidOTPEmail=new Map();
wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('{"Message":"Welcome New Client!"}');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    //wss.clients.forEach(function each(client) {
    //  if (client !== ws && client.readyState === WebSocket.OPEN) {
    //    client.send(message);
    //  }
    //});
    try {
      var Data = JSON.parse(message);
    if(Data.Type=="SignUp"){
      //{"Type":"SignUp","Name":"Manish","Email":"mkk9313@gmail.com","Password":"123456789","Confirm":"123456789"}
      if(!(Data.Email in UserDataBase)){
        var email = Data.Email;
        var name = Data.Name;
        var password = Data.Password;
        var confirm = Data.Confirm;
        if(password==confirm){
          ValidOTPEmail.set(email,{"OTP":sendmail.sendOTP(email,between(1000,9999),name),"Name":name,"Password":password});
          ws.send(`{"Type":"${Data.Type}","Message":"Successful"}`);
        }
        else{
          ws.send(`{"Type":"Error","Message":"Password!=Confirm"}`);
        }
      }
      else{
        ws.send(`{"Type":"Error","Message":"Email already exist."}`);
      }
        
      //console.log(`Email sent to ${email} for Signup.`);
      //ws.send(message.utf8Data);
    }
    else if(Data.Type=="OTP_Verification"){
      //{"Type":"OTP_Verification","Email":"mkk9313@gmail.com","OTP":8470}
      var email = Data.Email;
      
      if(ValidOTPEmail.has(email)){
        var name = ValidOTPEmail.get(email).Name;
        var password = ValidOTPEmail.get(email).Password;
        var OTP = Data.OTP;
        if(OTP==ValidOTPEmail.get(email).OTP){
          // Tranfer Files to main database
          UserDataBase[email]={"Name":name,"Password":password,"Email":email,"Files":[]};
          ws.send(`{"Type":"${Data.Type}","Message":"Successful"}`);
        }
        else{
          ws.send(`{"Type":"Error","Message":"Wrong OTP"}`);  
        }
      }
      else{
        ws.send(`{"Type":"Error","Message":"Need TO generate OTP first."}`);
      }

      
    }
    else if(Data.Type=="SignIn"){
      //{"Type":"SignIn","Name":"Manish","Email":"mkk9313@gmail.com","Password":"123456789"}
      var email = Data.Email;
      var password = Data.Password;
      //console.log(UserDataBase.hasOwnProperty(email),UserDataBase[email]);
      if((UserDataBase.hasOwnProperty(email) )){
        if(password==UserDataBase[email].Password){
          ws.send(`{"Type":"${Data.Type}","Message":"Successful"}`);
        }
        else{
          ws.send(`{"Type":"Error","Message":"Incorrect Password"}`);
        }
      }
      else{
        ws.send(`{"Type":"Error","Message":"Incorrect Email"}`);
      }
      
    }

    
    
    else if(Data.Type=="HRV"){
      //{"Email":"mkk9313@gmail.com","Password":"123456789","Type":"HRV","FileName":"covid1.csv"}
      var email = Data.Email;
      var password = Data.Password;
      //console.log(UserDataBase.hasOwnProperty(email),UserDataBase[email]);
      if((UserDataBase.hasOwnProperty(email) )){
        if(password==UserDataBase[email].Password){
          var filename = "./uploads/"+Data.FileName;
          var dataToSend='';
          // spawn new child process to call the python script
          const python = spawn('python3', ['PythonFiles/HRV.py',filename]);
          // collect data from script
          python.stdout.on('data', function (data) {
          console.log(`Pipe data from python script ...`);
          dataToSend += data.toString();
          });
          // in close event we are sure that stream from child process is closed
          python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code} `);
          // send data to browser
          if(dataToSend!="")
            ws.send(dataToSend)
          else
            ws.send(`{"Type":"Error","Message":"File Not Found."}`);
          });
        }
        else{
          ws.send(`{"Type":"Error","Message":"Incorrect Password"}`);
        }
      }
      }

       else if(Data.Type=="File"){
      //{"Email":"mkk9313@gmail.com","Password":"123456789","Type":"File","File":"JSON","Name":$Name}
      var email = Data.Email;
      var password = Data.Password;
      var data = Data.File; 
      //console.log(UserDataBase.hasOwnProperty(email),UserDataBase[email]);
      if((UserDataBase.hasOwnProperty(email) )){
        if(password==UserDataBase[email].Password){
	var readFile = Buffer.from(data,"base64");
	fsc.writeFileSync(Data.Name,readFile,"utf8");
	
	ws.send(`{"Type":"Error","Message":"File Uploaded."}`);
	//await res.send('{"message":"Done"}');

          /*var filename = "./uploads/"+Data.FileName;
          var dataToSend='';
          // spawn new child process to call the python script
          const python = spawn('python3', ['PythonFiles/HRV.py',filename]);
          // collect data from script
          python.stdout.on('data', function (data) {
          console.log(`Pipe data from python script ...`);
          dataToSend += data.toString();
          });
          // in close event we are sure that stream from child process is closed
          python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code} `);
          // send data to browser
          if(dataToSend!="")
            ws.send(dataToSend)
          else
            ws.send(`{"Type":"Error","Message":"File Not Found."}`);
          });*/
        }
        else{
          ws.send(`{"Type":"Error","Message":"Incorrect Password"}`);
        }
      }
      }
      
      else if(Data.Type=="POST_COVID"){
      //{"Email":"mkk9313@gmail.com","Password":"123456789","Type":"POST_COVID","FileName":"covid1.csv"}
      var email = Data.Email;
      var password = Data.Password;
      //console.log(UserDataBase.hasOwnProperty(email),UserDataBase[email]);
      if((UserDataBase.hasOwnProperty(email) )){
        if(password==UserDataBase[email].Password){
          var filename = "./uploads/"+Data.FileName;
          var dataToSend='';
          // spawn new child process to call the python script
          const python = spawn('python3', ['PythonFiles/Post_Covid.py',filename]);
          // collect data from script
          python.stdout.on('data', function (data) {
          console.log(`Pipe data from python script ...`);
          dataToSend += data.toString();
          });
          // in close event we are sure that stream from child process is closed
          python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code} `);
          // send data to browser
          if(dataToSend!="")
            ws.send(dataToSend)
          else
            ws.send(`{"Type":"Error","Message":"File Not Found."}`);
          });
        }
        else{
          ws.send(`{"Type":"Error","Message":"Incorrect Password"}`);
        }
      }
      
      else{
        ws.send(`{"Type":"Error","Message":"Incorrect Email"}`);
      }
      
      
    }
    
      
      
    else if(Data.Type=="FileName"){
      //{"Email":"mkk9313@gmail.com","Password":"123456789","Type":"FileName","FileName":"covid1.csv"}
      var email = Data.Email;
      var password = Data.Password;
      //console.log(UserDataBase.hasOwnProperty(email),UserDataBase[email]);
      if((UserDataBase.hasOwnProperty(email) )){
        if(password==UserDataBase[email].Password){
          assignIndex=assignIndex+1;
          UserDataBase["AssignIndex"]=assignIndex;
          UserDataBase[email]["Files"].push(`${email}_${2021}_${assignIndex}.csv`);
          console.log(assignIndex);
          ws.send(`{"Type":"${Data.Type}","FileName":"${email}_${2021}_${assignIndex}.csv"}`);
        }
        else{
          ws.send(`{"Type":"Error","Message":"Incorrect Password"}`);
        }
      }
      
      else{
        ws.send(`{"Type":"Error","Message":"Incorrect Email"}`);
      }
    }
    else{
      console.log('Received_Message: ' + Data.Hello);
      ws.send(`{"Type":"Error","Message":"Wrong Data Type."}`);
    }
    } catch (error) {
      
      ws.send('{"Type":"Error","Message":"Json not found"}');
       //expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
    
    
  });
});

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}
/*             END WebSocket                             */

/*             PAGES                                     */
// Home Page
app.use(express.static(path.join(__dirname,'ServerFiles/venus')));

// Demo Video
app.get('/demo',(req,res)=>{
  res.sendFile(path.join(__dirname,'./','ServerFiles/demo.mp4'));
});

// Upload Files
var multer  =   require('multer');  
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {
    console.log(req);  
    callback(null, file.originalname);  
  }  
});  
var upload = multer({ storage : storage}).single('myfile');  
app.get('/uploads',function(req,res){  
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



/*             END PAGES                                     */

/*             Save User Data Evey T Mins                   */
let UserDataBase={}
try{
  let rawdata = fs.readFileSync('./Database/DB.json');
  UserDataBase = JSON.parse(rawdata);
  //UserDataBase[email]={"Name":name,"Password":password,"Email":email};
  assignIndex=UserDataBase["AssignIndex"];
  }
catch(e){
  UserDataBase={};
  UserDataBase["AssignIndex"]=0;
  assignIndex=0;

}
//const jsonString = JSON.stringify(UserDataBase);
//console.log(`Save Data ${isAnyChangeInDatabase} ${UserDataBase.size} ${jsonString}`);

var isAnyChangeInDatabase=true;
var Interval = "1"; //mins
cron.schedule(`*/${Interval} * * * *`, () => {
  
  const jsonString = JSON.stringify(UserDataBase);
  console.log(`Save Data ${isAnyChangeInDatabase} ${UserDataBase.size} ${jsonString}`);
  fs.writeFile('./Database/DB.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
  })
});

/*             END Save User Data Evey T Mins                   */
var PORT = 8080;
server.listen(PORT, () => console.log(`Lisening on port :${PORT}`))
