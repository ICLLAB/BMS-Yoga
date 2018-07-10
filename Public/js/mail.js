 $(document).ready(function(){
    var from,to,subject,text;
    $("#send_email").click(function(){		
            to=$("#to").val();		
    $("#message").text("Sending E-mail...Please wait");
    
    $.get("http://localhost:3000/send",{to:to},function(data){
    if(data=="sent")
            {
    
                     // var scntDiv = $('#stu');           
    //var i = $('#stu tr').size() + 1;
    //$("#message").empty().html("<p>Email is been sent at "+to+" . Please check inbox !</p>");
                      alert("Email is been sent at "+to+" . Please check inbox !");
    
                     // $("#message").empty().html("<table border='1'> <tr>"+to+"</tr></table>");
                     //scntDiv.append 
                     $(".stu").append('<tr><td><div name="first_name">'+to+'</div></td></tr>');  
                      i++;
                      return false;
                     
                }
                else
                {
                      alert("INVALID");
                }
    });
        });
    });