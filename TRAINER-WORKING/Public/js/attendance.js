function attendanceClass(data) {
  this.date = ko.observable(data.date);
  this.center = ko.observable(data.center);
  this.slot = ko.observable(data.slot);
  this.editable = ko.observable(false);
}

function TrainerClass(data) {
  this.type = ko.observable(data.type);
  this.health_tip = ko.observable(data.health_tip);
  
  this.editable = ko.observable(false);
} 
function viewModel(){
  var self = this;
  self.Uattend  = ko.observableArray([]);
  self.newdate = ko.observable();
  self.newcenter = ko.observable();
  self.newslot = ko.observable();
  self.trainer  = ko.observableArray([]);
  self.newTrainertype = ko.observable();
  self.newTrainertip = ko.observable();
  ex1=ko.toJS(new attendanceClass({ date: this.newdate(), center:  this.newcenter(), slot: this.newslot()}));
self.attendance = function() {
  


  console.log('next in ');
 ex=ko.toJS(new attendanceClass({ date: this.newdate(), center:  this.newcenter(), slot: this.newslot()}));


  $.ajax({
    type: 'POST',
    
   url: 'https://bms-icl-yoga.herokuapp.com/package/dateslot/',

    data: ex ,
    success: function(response,textStatus,jqXHR) {

      
        //console.log(response);
        for(var i=0;i<response.total;i++){
           // alert(response.CURRENT_DAY_BOOKINGS[i].email);
            $("#tab tbody").append("<tr> <td>"+(i+1)+" </td> <td class='em'>"+response.CURRENT_DAY_BOOKINGS[i].email+" </td><td> <button class='attend'>yes</button></td></tr>");
          }

          $("#myModal").modal('show');
          $('.attend').click(function () {
            //console.log("hi");
          var $r = $(this).closest("tr");
          var $email =$r.find(".em").text();
          this.disabled = true;
          $.ajax({
              type: 'POST',              
             url: 'https://bms-icl-yoga.herokuapp.com/counter/attendancecount/email/' + $email,           
              data: ex,
              success: function(data) {
                //location.reload();
                alert("Attendence added");
               

            }
          })
          });
    
      
      }
  })





};

self.sendtip = function() {
  console.log('saved');
 
//  console.log(x);
  //console.log(username);
  $.ajax({
    type: 'POST',
    
   url: 'https://bms-icl-yoga.herokuapp.com/tip',
      
    data: ko.toJS(new TrainerClass({ type: this.newTrainertype(), health_tip:  this.newTrainertip()})),
    success: function(data) {
      alert("sent", data); //the new item is returned with an ID
      window.history.go(0);
    }
})};
$('#showw').click(function (){
alert("he");

  console.log('saved');
  $.ajax({
    type: 'POST',
    
   url: 'https://bms-icl-yoga.herokuapp.com/counter/attendants',
      
   data:ex,
   
    success: function(response,textStatus,jqXHR) {
      
      //console.log(response.total);
      //ON SUCCESS PRINT EMAIL 
        for (var i=0;i<response.total;i++){
         // $("#grid2 tbody").append("<tr> <td>"+(i+1)+" </td> <td>"+response.CURRENT_DAY_BOOKINGS[i].email+"</td></tr>");
          var $email=response.CURRENT_DAY_BOOKINGS[i].email;
          //console.log(email);
          $.ajax({
            type: 'GET',
            url: 'https://bms-icl-yoga.herokuapp.com/user/email/' + $email,
            
            success: function(data) {
              
              $.getJSON("https://bms-icl-yoga.herokuapp.com/user/email/" + $email, function (data) {

                $("#grid2 tbody").append("<tr> <td>"+(i)+" </td> <td>"+data.user_details[0].email+"</td><td>"+data.user_details[0].username+"</td></tr>");
            })
          }
          })

       
          
    }
 
    }
})
});


} 

function reload()
{
  //alert("hi");
  location.reload();
  //window.histroy.go(0);
}




ko.applyBindings(new viewModel());



