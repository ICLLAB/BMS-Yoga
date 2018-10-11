
function TrainerClass(data) {
  this.email = ko.observable(data.email);
  this.password = ko.observable(data.password);
  this.editable = ko.observable(false);
}
function viewModel(){
  var self = this;
  self.trainer  = ko.observableArray([]);
  self.newTrainerLEmail = ko.observable();
  self.newTrainerLPass = ko.observable();

self.loginTrainer = function() {

  //console.log('LOGGED in ');
 
//  console.log(x);
  //console.log(username);
  $.ajax({
    type: 'POST',
   url:'https://bms-icl-yoga.herokuapp.com/trainer/login',

    data: ko.toJS(new TrainerClass({ email: this.newTrainerLEmail(), password:  this.newTrainerLPass()})),
    success: function(data) {
      document.getElementById('spin').style.display='none';
     window.location.pathname = "index.html";
    },
    error: function (error) {
      document.getElementById('spin').style.display='none';
    alert('INvalid Email or Password');
}
})


};
document.getElementById('spin').style.display='none';
document.getElementById('show').onclick=function(){
  document.getElementById('spin').style.display='block';
}


} 
ko.applyBindings(new viewModel());


