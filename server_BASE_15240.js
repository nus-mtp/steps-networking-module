var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + '/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));  // redirect CSS bootstrap

app.get('/',function(req,res){
  res.sendFile('index.html');   //It will find and locate index.html from View or Scripts
});

app.listen(port);

console.log("Running at Port 3000");
