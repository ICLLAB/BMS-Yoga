
var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hathwar.sanjana@gmail.com",
        pass: "SAN7259473132"
    }
});
var rand,mailOptions,host,link;

app.get('/',function(req,res){
res.sendfile('Public/index.html');
});
app.get('/send',function(req,res){
        rand=Math.floor((Math.random() * 100) + 54);
	host=req.get('host');
	link="http://"+req.get('host')+"/verify?id="+rand;
	
	mailOptions={
		to : req.query.to,
		subject : "Please confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
	}
console.log(mailOptions);
smtpTransport.sendMail(mailOptions, function(error, response){
   	 if(error){
        	console.log(error);
res.end("error");
	 }else{
        	console.log("Message sent: " + response.message);
res.end("sent");
    	 }
});
});




var port = process.env.PORT || 5000;
/*--------------------Routing Over----------------------------*/
app.use(express.static('Public'));
app.listen(port,function(){
console.log("Express Started on Port 3000");
});