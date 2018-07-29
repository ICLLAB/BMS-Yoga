function forgotclass(data) {
    this.newPassword = ko.observable(data.newPassword);
    this.verifyPassword = ko.observable(data.verifyPassword);
    this.editable = ko.observable(false);
  }
  function viewModel(){
    var self = this;
    self.user  = ko.observableArray([]);
    self.newUPassword = ko.observable();
    self.verifyUPassword = ko.observable();
  
  self.forgot = function() {
    console.log('password changed ');
   
  //  console.log(x);
    //console.log(username);
    $.ajax({
      type: 'POST',
      
     url: 'http://protected-plateau-97422.herokuapp.com/user/reset/2417fdfc13d879596d7d25d4d86a3cb4e286fb61',
  
      data: ko.toJS(new forgotclass({ newPassword: this.newUPassword(), verifyPassword:  this.verifyUPassword()})),
      success: function(data) {
      
        alert("password changed");
      }
  })
  
  
  };
  } 
  ko.applyBindings(new viewModel());
  
  
  
  