
$(function (){

    function check(x)
    {
        if(typeof x === 'undefined')
        {
            //alert("hi");
            return "-";
        }

        return x;
    }
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
            url: 'https://bms-icl-yoga.herokuapp.com/trainer/',
            success: function(data) {
                $.getJSON("https://bms-icl-yoga.herokuapp.com/trainer/", function (data) {

          var all = new Array();

         // console.log(data.trainer[0]);
             //   console.log(data.trainer[0].trainer_details.f_name);
          for(i=0;i<data.count;i++)
            {
                all[i] = [
                    [ data.trainer[i].trainer_details.f_name,data.trainer[i].trainer_details.m_name,data.trainer[i].trainer_details.l_name,data.trainer[i].trainer_details.phone,data.trainer[i].trainer_details.creation_time,data.trainer[i].trainer_details.lastLogin]
                    
                ]
            }
          $('#example').DataTable( {
            

            //targets 0 is ID coloumn , visible false
            "columnDefs": [
            {
                
                "targets": [ 0 ],
                "visible": false,
            },
        ],
        columns: [
            { title: "ID"},
            { title: "SL_NO" },
            { title: "First Name" },
            { title: "Middle Name" },
            { title: "Last Name" },
            { title: "Phone" },
            { title: "Creation Time" },
            { title: "Last Login" },
            { title: " " }
            
            
        ]
        } )

        for(i=0;i<data.count;i++)
        {
            
           // $("#example tbody").append("<tr> <td class='nr'>"+data.trainer[i]._id+" </td></tr>");
            $('#example').DataTable().row.add( [data.trainer[i].trainer_details._id, (i+1),data.trainer[i].trainer_details.f_name,data.trainer[i].trainer_details.m_name,data.trainer[i].trainer_details.l_name,data.trainer[i].trainer_details.phone,data.trainer[i].trainer_details.creation_time,data.trainer[i].trainer_details.lastLogin,"<button class='use mdl-button mdl-js-button mdl-button--icon mdl-button--colored '><i class='material-icons'>delete</i></button><button data-toggle='modal' class='editbtn'>Edit</button>"])
            .draw()
            .node();
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

                         
                        var bm = {"f_name":"abhi"};
                         //alert($tx);
                         console.log(JSON.stringify(bm));
                            var updateString = 'https://protected-plateau-97422.herokuapp.com/trainer/id/' + data[0];
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

                }
      
                $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')
      
            });
      
        });

        self.removeTrainer = function(trainer) { self.trainer.remove(trainer), self.deleteTrainer(trainer) };

        $('.use').click( function () {
            $('#example tbody').on('click', 'tr', function () {
            var table = $('#example').DataTable();
            var data = table.row( this ).data();
           //alert( "Delete Trainer" );

            

           //data[0] hidden id
            var deletionString = 'https://bms-icl-yoga.herokuapp.com/trainer/' + data[0];
           // console.log(data[0]);
            $.ajax({
            type: 'DELETE',
            url: deletionString,
            success: function() {
                //no data...just a success (200) status code
                //alert(data[0]+ " Removed");
              // console.log(data[0]);
                console.log('Trainer Deleted Successfully!');
                window.history.go(0);
                }
            });
        });
        } );
      
       
      });
   
              }
          }); 
        self.saveTrainer = function() {
            console.log('saved');
            var x = check(this.newTrainerMName());
            var y = check(this.newTrainerLName());
          //  console.log(x);
            //console.log(username);
            $.ajax({
              type: 'POST',
              
             url: 'https://bms-icl-yoga.herokuapp.com/trainer/signup',

              data: ko.toJS(new TrainerClass({  f_name:  this.newTrainerFName(),m_name:  x,l_name:  y,phone:  this.newTrainerPhone(),username: this.newTrainerUName(),email:  this.newTrainerEmail(),password:  this.newTrainerPassword()})),
              success: function(data) { alert("hi");
                console.log("patient added!", data); //the new item is returned with an ID
                window.history.go(0);
              } 
        })};
    
        //var xyz ="";
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
    
    
    