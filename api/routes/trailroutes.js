const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Trail = require("../models/trail");



var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 0);
   d.setMinutes(d.getMinutes() + 0);
     var n = d.toLocaleString();
   return n;
  };


//book for a particular trail class by the user [passed by email]
//http://localhost:3000/trail/trailbook/email/


router.post("/trailbook/email/:emailId", (req, res, next) => {
  //const email = req.params.emailId;
  User.findOne({email:req.params.emailId})
    .then(email => {
      if (!email) {
        return res.status(404).json({
          message: "user not found"
        });
      }
      const trail = new Trail({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        slot: req.body.slot,
        center: req.body.center,
        email: req.params.emailId,
      });
      return trail.save();
    })
    .then(result => {
      console.log(result),
      Trail.update({email:req.params.email},{$set : { booking_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } )
      res.status(201).json({
        message: "WAIT FOR THE CONFIRMATION OF CLASSS BY THE TRAINER [passed by email]"
        
        
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


/*

//book for a particular trail class by the user [passed by id]
//http://localhost:3000/trail/trailbook/id/

router.post("/trailbook/id/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "user not found"
        });
      }
      const trail = new Trail({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        slot: req.body.slot,
        center: req.body.center,
        user: req.params.userId,
      });
      return trail.save();
    })
    .then(result => {
      console.log(result),
      Trail.update({user:req.body.user},{$set : { booking_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } )
      res.status(201).json({
        message: "WAIT FOR THE CONFIRMATION OF CLASSS BY THE TRAINER [passed by id]"
        
        
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




//to get all users all trailed schedules (complete booking details)
//http://localhost:3000/trail/

router.get("/", (req, res, next) => {
  Trail.find()
  .select("email id date slot center booking_time ")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      COMPLETE_DETAILS: docs.map(doc => {
        return {
          id: doc.id,
          email:doc.email,
          date: doc.date,
          slot: doc.slot,
          center:doc.center,
          booking_time: doc.booking_time
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


/*

//to get particular users all booked schedules (=> ID  complete booking details)
//http://localhost:3000/trail/id/


router.get("/id/:userId", (req, res, next) => {
  Trail.find({user:req.params.userId})
    .select('id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TRAIL_SESSION_TOTAL_COUNT: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided ID" });
      }
    })
    .catch
    (err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

*/




//to get particular users all booked schedules (=> EMAIL complete booking details)
//http://localhost:3000/trail/email/


router.get("/email/:userEmail", (req, res, next) => {
  email =req.params.userEmail;
  Trail.find({email})
    .select('email id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TRAIL_SESSION_TOTAL_COUNT: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided ID" });
      }
      
    })
    .catch
    (err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



/*

//to get particular users [ last ]  booked schedules
//http://localhost:3000/trail/lastbooked/id/

router.get("/lastbooked/id/:userId", (req, res, next) => {
  Trail.find({user:req.params.userId}).sort({"booking_time": -1}).limit(1)
 .select('id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          count: doc.length,
            LAST_BOOKED_SCHEDULE: 
            doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

*/



//to get particular users [ last ]  booked schedules
//http://localhost:3000/trail/lastbooked/email/

router.get("/lastbooked/email/:userEmail", (req, res, next) => {
   email =req.params.userEmail;
  Trail.find({email}).sort({"booking_time": -1}).limit(1)
 
    .select('id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          count: doc.length,
            LAST_BOOKED_SCHEDULE: 
            doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS
  //http://localhost:3000/trail/currentday/


  router.get("/currentday", (req, res, next) =>
{
  Trail.find(
      {
          "date": 
          {
              $gte: new Date((new Date().getTime() - (0* 24 * 60 * 60 * 1000)))
          }
      }
      )
      .sort({ "date": -1 })
      .select("attendance date")
      .exec()
      .then(docs => {
        const response = {
         total: docs.length,
          CURRENT_DAY_ATTENDANCE_OF_ALL_USERS: docs.map(doc => {
            return {
              userzz_id: doc.attendance,
              id:doc._id,
              booked_date: doc.date
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








//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS
//http://localhost:3000/trail/getbydate/


router.post("/getbydate", (req, res, next) =>
{
  const schedule = req.body.schedule;
 //find the details of users booked schedule for a particular class
 Trail.find({date: {$eq: schedule} })
  .select("email date")
  .exec()
  .then(docs => {
    const response = {
     total: docs.length,
      CURRENT_DAY_BOOKINGS: docs.map(doc => {
        return {
          email: doc.email,
          id:doc._id,
          booked_date: doc.date
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