function TrainerClass(data) {
    this.type = ko.observable(data.type);
    this.health_tip = ko.observable(data.health_tip);
    
    this.editable = ko.observable(false);
} 
function viewModel(){
    var self = this;
    self.trainer  = ko.observableArray([]);
    self.newTrainertype = ko.observable();
    self.newTrainertip = ko.observable();
self.sendtip = function() {
    console.log('saved');
   
  //  console.log(x);
    //console.log(username);
    $.ajax({
      type: 'POST',
      
     url: 'https://protected-plateau-97422.herokuapp.com/tip',
        
      data: ko.toJS(new TrainerClass({ type: this.newTrainertype(), health_tip:  this.newTrainertip()})),
      success: function(data) {
        alert("sent", data); //the new item is returned with an ID
        window.history.go(0);
      }
})};


} 
ko.applyBindings(new viewModel());






