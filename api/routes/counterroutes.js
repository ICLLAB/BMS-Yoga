const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Counter = require("../models/counter");
const Package = require("../models/package");







/*

//handle post request (take attendance)
//http://localhost:3000/count/attendancecount/id/


router.post("/attendancecount/id/:packageId", (req, res, next) => {
  Package.findById(req.params.packageId)
    .then(package => {
      if (!package) {
        return res.status(404).json({
          message: "patient not found"
        });
      }
      const counter = new Counter({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        //center: req.body.center,
       // slot:req.body.slot,
       
       
        user: req.params.packageId
      });
      return counter.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "attendance updated"
        
       
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

*/


//handle post request (take attendance)
//http://localhost:3000/counter/attendancecount/email/

router.post("/attendancecount/email/:packageEmail", (req, res, next) => {
  const email = req.params.packageEmail;
  Package.findOne({email})
    .then(email => {
      if (!email) {
        return res.status(404).json({
          message: "patient not found"
        });
      }
      const counter = new Counter({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        center: req.body.center,
        slot:req.body.slot,
        email: req.params.packageEmail
      });
      return counter.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "attendance updated"
        
       
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



//TO GET COMPLETE DETAILS OF ALL PATIENTS   ===> ATTENDANCE DETAILS
//http://localhost:3000/counter/attendancecount/

router.get("/attendancecount", (req, res, next) => {
  Counter.find()
    .select("email slot")
    .populate('_id ')
    .exec()
    .then(docs => {
      res.status(200).json({
        total_count: docs.length,
        counterroutes: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            date: doc.date,
            center:doc.center,
            slot:doc.slot,
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



//TO GET COMPLETE DETAILS OF  ===>  PARTICULAR PATIENTS ATTENDANCE DETAILS 
//http://localhost:3000/counter/attendancecount/

router.get("/attendancecount/:counterEmail", (req, res, next) => {
  Counter.find({email:req.params.counterEmail})
    .exec()
    .then(counter => 
      {
      if (!counter) 
      {
        return res.status(404).json
        ({
        message: "attendance not found"
        });
      }
      res.status(200).json
      ({
        PARTICULAR_USER_COMPLETE_BOOKING_DETAILS: 
        counter.length,
        counter
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});





//get attendance details between two dates
//http://localhost:3000/counter/getbydate/

router.post("/getbydate", (req, res, next) =>
{
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

//find all the record whose start & end date is between than starting & ending dates
 Counter.find({date: {$gte: startDate} , date:{$lte: endDate}},function(err, records) {

          if (err)
              res.send(err);
          var formattedrecords=[];
          for(var i = 0;i<records.length;i++)
          {
            formattedrecords.push(
              {
                "email":records[i].email,
               "date":records[i].date
              }
            )
          }
          res.json(formattedrecords);
      })
});





//get attendance details of last 7 days of all users (INCLUDING TODAY)
//http://localhost:3000/counter/getby

router.get("/getby", (req, res, next) =>
{
  Counter.find(
      {
          "date": 
          {
              $gte: new Date((new Date().getTime() - (6* 24 * 60 * 60 * 1000)))
          }
      }
      ).sort({ "date": -1 })
     .select("date email slot center")
      .exec()
      .then(docs => {
        const response = {
         total: docs.length,
          LAST_7_DAYS_TOTAL_COUNT_ATTENDEND_BY_ALL_USERS: docs.map(doc => {
            return {
              email:doc.email,
              attended_date: doc.date,
              center:doc.center,
            slot:doc.slot,
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

     




//get data of last 7 days of particular user (INCLUDING TODAY)
  //http://localhost:3000/counter/att/


  router.get("/att/:counterEmail", (req, res, next) => {
    Counter.find({
      email:req.params.counterEmail, 
      "date": {
              $gte: new Date((new Date().getTime() - (6* 24 * 60 * 60 * 1000)))
              }
      })
     .sort({"date": -1 })
      .exec()
      .then(docs => {
        res.status(200).json({
          total: docs.length,
          LAST_7_DAYS_ATTENDANCE_OF_PARTICULAR_USER: docs.map(doc => {
            return {
              email: doc.email,
              attended_date: doc.date
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


//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS (who all have attended)
//http://localhost:3000/counter/attended/



 
router.post("/attended", (req, res, next) =>
{
  const schedule = req.body.schedule;
 //find the details of users booked schedule for a particular class
 Counter.find({date: {$eq: schedule} })
  .select("email date center slot")
  .exec()
  .then(docs => {
    const response = {
     total: docs.length,
      CURRENT_DAY_BOOKINGS: docs.map(doc => {
        return {
          email: doc.email,
          id:doc._id,
          booked_date: doc.date,
          center: doc.center,
          slot:doc.slot
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


module.exports = router;