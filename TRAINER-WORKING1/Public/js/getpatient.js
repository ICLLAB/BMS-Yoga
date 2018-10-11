$('#getuser').click(function () {
alert("hi");
window.location.pathname = "attendance.html";
    $.ajax({
        type: 'GET',
        
       url: 'https://bms-icl-yoga.herokuapp.com/user',
       success: function(data) {
       
    
        $.getJSON("https://bms-icl-yoga.herokuapp.com/user", function (data) {
            for (var i=0;i<data.count;i++){
            $("#grid1 tbody").append("<tr> <td hidden>"+data.user_details[i]._id+" </td> <td>"+data.user_details[i].f_name+" </td> <td>"+data.user_details[i].m_name+" </td><td>"+data.user_details[i].l_name+" </td><td>"+data.user_details[i].email+" </td>");

        } 
       })
  
        }
    })
})