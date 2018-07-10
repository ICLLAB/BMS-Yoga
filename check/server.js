

var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hathwar.sanjana@gmail.com",
        pass: "SANJANA@2795"
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

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
console.log("Domain is matched. Information is from Authentic email");
if(req.query.id==rand)
	{
console.log("email is verified");
res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
	}
else
	{
console.log("email is not verified");
res.end("<h1>Bad Request</h1>");
	}
}
else
{
res.end("<h1>Request is from unknown source");
}
});



var emailCheck = require('email-check');
emailCheck('xyz@gmail.com', {
  from: '1BM16MCA35@bmsce.ac.in',
  host: 'mail.google.com',
  timeout: 3000
})
  .then(function (res) { 
    console.log(res);
  })
  .catch(function (err) {
    console.error(err);
  });


var port = process.env.PORT || 7000;
/*--------------------Routing Over----------------------------*/
//app.use(express.static('Public'));
app.listen(3000,function(){
console.log("Express Started on Port 3000");
});