$('.attend').click(function (){


    console.log('saved');
    $.ajax({
      type: 'GET',
      
     url: 'https://bms-icl-yoga.herokuapp.com/counter/today/date',
        
     
      success: function(data) {
        $.getJSON("https://bms-icl-yoga.herokuapp.com/counter/today/date", function (data) {
          for (var i=0;i<data.TOTAL_COUNT_OF_BOOKINGS_BY_A_USERS_FOR_TODAY;i++){
          $("#grid2 tbody").append("<tr> <td>"+(i+1)+" </td> <td>"+data.ALL_BOOKING_DETAILS_OF_USER[i].email+"</td></tr>");
            
      }
     })
      }
})});








