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
  console.log('LOGGED in ');
 
//  console.log(x);
  //console.log(username);
  $.ajax({
    type: 'POST',
    
   url: 'https://protected-plateau-97422.herokuapp.com/trainer/login',

    data: ko.toJS(new TrainerClass({ email: this.newTrainerLEmail(), password:  this.newTrainerLPass()})),
    success: function(data) {
    
      window.location.pathname = "index.html";
    }
})


};
/*self.loginTrainer = function() {
 

  self.trainer.push(new TrainerClass({ email: this.newTrainerLEmail(), password:  this.newTrainerLPass()}));
  self.saveTrainer();
  self.newTrainerLEmail("");
  self.newTrainerLPass("");

 
  
};*/





} 
ko.applyBindings(new viewModel());



