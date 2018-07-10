$(function (){

    function TrainerClass(data) {
        this.username = ko.observable(data.username);
        this.f_name = ko.observable(data.f_name);
        this.phone = ko.observable(data.phone);
        this.email = ko.observable(data.email);
        this.password = ko.observable(data.password);
        this.editable = ko.observable(false);
    }
    
    function viewModel(){
        var self = this;
        self.trainer  = ko.observableArray([]);
        self.newTrainerUName = ko.observable();
        self.newTrainerFName = ko.observable();
        self.newTrainerPhone = ko.observable();
        self.newTrainerEmail = ko.observable();
        self.newTrainerPassword = ko.observable();
        
    
        
        $.ajax({
            type: 'GET',
            url: 'https://rocky-reaches-97928.herokuapp.com/trainer',
            success: function(data) {
            
    
                $.getJSON("https://rocky-reaches-97928.herokuapp.com/trainer", function (data) {
          //console.log(data);
          var counter = 0;
          var dele="<input type='button' value='DELETE' id='del' onclick='del()'/> ";
          for (var i=0;i<data.count;i++)
          {
          
           $("#grid1 tbody").append("<tr><td>"+data.trainer[i]._id+" </td> <td>"+data.trainer[i].f_name+" </td> <td>"+data.trainer[i].m_name+" </td><td>"+data.trainer[i].l_name+" </td><td>"+data.trainer[i].phone+" </td><td>"+data.trainer[i].creation_time+" </td><td>"+data.trainer[i].lastLogin+" </td><td>"+dele+"</td></tr>");
          }
            
       
      });
               
               
              }
          });
    
    
        self.saveTrainer = function() {
            console.log('saved');
            $.ajax({
              type: 'POST',
             
             url: 'https://rocky-reaches-97928.herokuapp.com/trainer/signup',
    
              data: ko.toJS(new TrainerClass({ username: this.newTrainerUName(), f_name:  this.newTrainerFName(),phone:  this.newTrainerPhone(),email:  this.newTrainerEmail(),password:  this.newTrainerPassword()})),
              success: function(data) {
                console.log("patient added!", data); //the new item is returned with an ID
              }
        })};
    
    
        self.addTrainer = function() {
                self.trainer.push(new TrainerClass({ username: this.newTrainerUName(), f_name:  this.newTrainerFName(),phone:  this.newTrainerPhone(),email:  this.newTrainerEmail(),password:  this.newTrainerPassword()}));
                self.saveTrainer();
                self.newTrainerUName("");
                self.newTrainerFName("");
                self.newTrainerPhone("");
                self.newTrainerEmail("");
                
        };
    
     
    
    } 
    ko.applyBindings(new viewModel());
    
    });
    function del() {
        tr = $(this).parent()
        var id = $(this).attr('_id');
        $.ajax({
            url: 'https://rocky-reaches-97928.herokuapp.com/trainer/' + id,
            type: 'DELETE',
            success: function(data) {
                tr.fadeOut(1000, function(){
                    $(this).remove();
                });

            }
        
        });
    }
    
    