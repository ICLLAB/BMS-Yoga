$(function (){

    function TrainerClass(data) {
        this.username = ko.observable(data.username);
        this.f_name = ko.observable(data.f_name);
        this.m_name = ko.observable(data.m_name);
        this.l_name = ko.observable(data.l_name);
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
        self.newTrainerMName = ko.observable();
        self.newTrainerLName = ko.observable();
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
          
    
          for (var i=0;i<data.count;i++)
          {
            var middle=data.trainer[i].m_name;
            var last=data.trainer[i].l_name;
    
           $("#grid1 tbody").append("<tr> <td class='nr' >"+data.trainer[i]._id+" </td> <td contenteditable='false' class='sa' >"+data.trainer[i].f_name+" </td> <td contenteditable='false' class='mn' >"+data.trainer[i].m_name+" </td><td contenteditable='false' class='ln' >"+data.trainer[i].l_name+" </td><td contenteditable='false' class='ph' >"+data.trainer[i].phone+" </td><td>"+data.trainer[i].creation_time+" </td> <td>"+data.trainer[i].lastLogin+" </td> <td> <button class='use'>Delete</button></td> <td> <button class='editbtn'>Edit</button></td></tr>");
           
         }

        $(document).ready(function () {
            $('.editbtn').click(function () {
                var currentTD = $(this).parents('tr').find('td');
                if ($(this).html() == 'Edit') {
                    currentTD = $(this).parents('tr').find('td');
                    $.each(currentTD, function () {
                        $(this).prop('contenteditable', true)
                    });
                } else {
                   $.each(currentTD, function () {
                        $(this).prop('contenteditable', false)
                       // console.log(currentTD);
                        
                    });
                    //console.log(currentTD);
                         var $r = $(this).closest("tr");  
                         var $tid = $r.find(".nr").text();  // Find the row
                         var $tx = $r.find(".sa").text(); // Find the text

                         
                         var $tx1 = $r.find(".mn").text(); // Find the text
                        console.log($tx);
                        var $tx2 = $r.find(".ln").text();
                        var $tx3 = $r.find(".ph").text();


                        //console.log($tid,$tx,$tx1,$tx2,$tx3);

                         
                        var bm = [{"propName" : "f_name","value":"abhi"}];//[{"propName" : "f_names","value":$tx},{"propName" : "m_name","value":$tx1},{"propName" : "l_name","value":$tx2},{"propName" : "phone","value":$tx3}];
                         //alert($tx);
                         console.log(JSON.stringify(bm));
                            var updateString = 'https://rocky-reaches-97928.herokuapp.com/trainer/5b4845c0316eeb0004237fc4';//+$tid;
                            //console.log(this.name());
                            $.ajax({
                            type: 'PUT',
                            dataType:'application/json',
                            data:JSON.stringify(bm),
                            url: updateString,
                            success: function() {
                              //no data...just a success (200) status code
                              console.log('Trainer Updated Successfully!');
                              alert("YES");
                            }
                          })

    

                         //alert($tx);


                }
      
                $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')
      
            });
      
        });

        self.removeTrainer = function(trainer) { self.trainer.remove(trainer), self.deleteTrainer(trainer) };

        $(".use").click(function() {
            var $row = $(this).closest("tr");    // Find the row
            var $text = $row.find(".nr").text(); // Find the text
            //alert($text);

            var deletionString = 'https://rocky-reaches-97928.herokuapp.com/trainer/' + $text;
            console.log(deletionString);
            $.ajax({
            type: 'DELETE',
            url: deletionString,
            success: function() {
                //no data...just a success (200) status code
                alert($text+ " Removed");
                console.log('Trainer Deleted Successfully!');
                }
        });
            //alert($text);
        });
       
      });
   
              }
          });
    
        
        self.saveTrainer = function() {
            console.log('saved');
            //console.log(username);
            $.ajax({
              type: 'POST',
             
             url: 'https://rocky-reaches-97928.herokuapp.com/trainer/signup',

              data: ko.toJS(new TrainerClass({ username: this.newTrainerUName(), f_name:  this.newTrainerFName(),m_name:  this.newTrainerMName(),l_name:  this.newTrainerLName(),phone:  this.newTrainerPhone(),email:  this.newTrainerEmail(),password:  this.newTrainerPassword()})),
              success: function(data) {
                console.log("patient added!", data); //the new item is returned with an ID
              }
        })};
    
        var xyz ="";
        self.addTrainer = function() {
                //console.log();

                if(typeof(this.newTrainerMName()) == 'undefined')
                
                    
                

                    //break;
                        
                    
                  //  var x = "sanjana";

                self.trainer.push(new TrainerClass({ username: this.newTrainerUName(), f_name:  this.newTrainerFName(),m_name:"",l_name:  this.newTrainerLName(),phone:  this.newTrainerPhone(),email:  this.newTrainerEmail(),password:  this.newTrainerPassword()}));
                self.saveTrainer();
                self.newTrainerUName("");
                self.newTrainerFName("");

               // self.newTrainerMName("");
                self.newTrainerLName("");
                self.newTrainerPhone("");
                self.newTrainerEmail("");
                
        };
    
     
    
    } 
    ko.applyBindings(new viewModel());
    
    });
    
    
    