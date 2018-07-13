
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Count = require("../models/count");
const Attendance = require("../models/attendance");





// Handle incoming GET requests to patients
router.get("/attendancecount", (req, res, next) => {
  Count.find()
    .select("email attendance date zdate _id")
    .populate('attendance email')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        countroutes: docs.map(doc => {
          return {
            _id: doc._id,
            attendance: doc.attendance,
            date: doc.date,
            //zdate:doc.zdate,
            request: {
              type: "GET",
              //url: "http://localhost:3000/counterroutes/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



//handle post request (add count to attendance)

router.post("/attendancecount", (req, res, next) => {
  Attendance.findById(req.body.attendanceId)
    .then(attendance => {
      if (!attendance) {
        return res.status(404).json({
          message: "patient not found"
        });
      }
      const count = new Count({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        //zdate: req.body.zdate,
        attendance: req.body.attendanceId
      });
      return count.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "attendance updated",
        
        request: {
          type: "GET",
      //    url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});




router.get("/attendancecount/:countId", (req, res, next) => {
  Count.find({attendance:req.params.countId})
    .exec()
    .then(count => {
      
      if (!count) {
        
        return res.status(404).json({
          message: "attendance not found"
        });
      }
      res.status(200).json({
        count: count,
        request: {
          type: "GET"
          //url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



// get data between two dates


router.post("/getbydate", (req, res, next) =>
{
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
    //find all the record whose start & end date is between than starting & ending dates
  Count.find({date: {$gte: startDate},date:{$lte: endDate}},function(err, records) {
          if (err)
              res.send(err);
          var formattedrecords=[];
          for(var i = 0;i<records.length;i++){
            formattedrecords.push(
              {
               // "title":records[i].title,
                //"email":records[i].email,
               "date":records[i].date
                //"zdate":records[i].zdate
              }
            )
          }
          res.json(formattedrecords);
      });
});




/*
router.get("/attendancecount/:countId", (req, res, next) => {
  Count.find({attendance:req.params.countId})


*/

   


//get data of last 7 days


router.get("/getby", (req, res, next) =>
{
  //var startDate = req.body.startDate;
 // var endDate = req.body.endDate;
    //find all the record whose start & end date is between than starting & ending dates

    Count.find(
      {
          "date": 
          {
              $gte: new Date((new Date().getTime() - (7* 24 * 60 * 60 * 1000)))
          }
      }
      ).sort({ "date": -1 })
     .select("date")
      .exec()
      .then(docs => {
        const response = {
         count: docs.length,
          count: docs.map(doc => {
            return {
              //health_tip: doc.health_tip,
              date: doc.date,
             // _id: doc._id,
              request: {
                type: "GET",
               // url: "http://localhost:3000/tip/"+ doc._id
                
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

     






  router.get("/att/:countId", (req, res, next) => {
    Count.find({
      attendance:req.params.countId, 
      "date": {
              $gte: new Date((new Date().getTime() - (1* 24 * 60 * 60 * 1000)))
              }
      })
     .sort({"date": -1 })
      .exec()
      .then(docs => {
        res.status(200).json({
          total: docs.length,
          countroutes: docs.map(doc => {
            return {
              _id: doc._id,
             // email: doc.email,
              date: doc.date,
              //zdate:doc.zdate,
              request: {
                type: "GET",
                //url: "http://localhost:3000/counterroutes/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });



  /*

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
         // url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

*/



module.exports = router;