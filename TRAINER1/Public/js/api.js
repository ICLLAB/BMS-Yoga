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
self.saveTrainer = function() {
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
self.addTrainer = function() {
    //console.log();

    
        
    

        //break;
            
        
      //  var x = "sanjana";

    self.trainer.push(new TrainerClass({ type: this.newTrainertype(), health_tip:  this.newTrainertip()}));
    self.saveTrainer();
    self.newTrainertype("");
    self.newTrainertip("");

   // self.newTrainerMName("");
    
};


} 
ko.applyBindings(new viewModel());






