var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + '/dist'));

app.get('/',function(req,res){
  res.sendFile('index.html');
  //It will find and locate index.html from View or Scripts
});

app.listen(port);

console.log("Running at Port 3000");
