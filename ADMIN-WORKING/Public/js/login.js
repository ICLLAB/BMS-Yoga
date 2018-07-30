function log() {
  
    var user=document.getElementById("username").value;
    var pw=document.getElementById("password").value;
  if(user=="admin" && pw=="admin")
  {

   // alert("Hi");
    window.location.pathname = "home.html";
  }
  else
  {
    alert("WRONG USERNAME ID OR PASSWORD");
  } 
  
  }
  