var express=require('express');
var nodemailer = require("nodemailer");
var app=express();


 
app.get('/',function(req,res){
    //res.sendfile('Public/index.html');
    path = require('path');
            res.sendFile('home.html', { root: path.join(__dirname, './Public') });
    });


var port = process.env.PORT || 3000;
/*--------------------Routing Over----------------------------*/
app.use(express.static('Public'));
app.listen(port,function(){
console.log("Express Started on Port 3000");
}); 