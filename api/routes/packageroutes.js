const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Package = require("../models/package");



var minuteFromNow = function()
{
    var d = new Date();
     d.setHours(d.getHours() + 0);
   d.setMinutes(d.getMinutes() + 0);
     var n = d.toLocaleString();
   return n;
};


//book for a particular class by the user [passed by email]
//http://localhost:3000/package/packagebook/email/


router.post("/packagebook/email/:emailId", (req, res, next) => {
  //const email = req.params.emailId;
  User.findOne({email:req.params.emailId})
    .then(email => {
      if (!email) {
        return res.status(404).json({
          message: "user not found"
        });
      }
      const package = new Package({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        slot: req.body.slot,
        center: req.body.center,
        email: req.params.emailId,
      });
      return package.save();
    })
    .then(result => {
      console.log(result),
      Package.update({email:req.params.email},{$set : { booking_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } )
      res.status(201).json
      ({
        message: " CLASS BOOKED SUCCESSFULLY [passed by email] "
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

//book for a particular class by the user [passed by id]
//http://localhost:3000/package/packagebook/id/

router.post("/packagebook/id/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "user not found"
        });
      }
      const package = new Package({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        slot: req.body.slot,
        center: req.body.center,
        user: req.params.userId,
      });
      return package.save();
    })
    .then(result => {
      console.log(result),
      Package.update({user:req.params.user},{$set : { booking_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } )
      res.status(201).json
      ({
        message:  " CLASS BOOKED SUCCESSFULLY [passed by id]"
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



//to get all users all booked schedules (complete booking details ALL CENTERS)
//http://localhost:3000/package/


router.get("/", (req, res, next) => {
  Package.find()
  .select("email id date slot center ")
  //booking_time 
  //.populate('user')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      COMPLETE_DETAILS: docs.map(doc => {
       return {
          id: doc.id,
          //username:doc.username,
          email:doc.email,
          date: doc.date,
          slot: doc.slot,
          center:doc.center,
          //booking_time: doc.booking_time
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




//to get all booked schedules BASED ON CENTER (=> EMAIL complete booking details PARTICULAR CENTER)
//http://localhost:3000/package/center/

router.get("/center/:userCenter", (req, res, next) => {
  center =req.params.userCenter;
  Package.find({center})
    .select('email id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No centre" });
      }
      
    })
    .catch
    (err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



/*
//to get particular users all booked schedules (=> ID complete booking details)
//http://localhost:3000/package/id/

router.get("/id/:userId", (req, res, next) => {
  Package.find({user:req.params.userId})
    .select('id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
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



//to get particular users all booked schedules (=> EMAIL complete booking details)
//http://localhost:3000/package/email/


router.get("/email/:userEmail", (req, res, next) => {
  email =req.params.userEmail;
  Package.find({email})
    .select('email id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided email" });
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
//http://localhost:3000/package/lastbooked/id/

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




//to get particular users [ last ]  booked schedules (for app)
//http://localhost:3000/package/lastbooked/email/

router.get("/lastbooked/email/:userEmail", (req, res, next) => {
 email =req.params.userEmail;
 Package.find({email}).sort({"booking_time": -1}).limit(1)

   .select('email id date slot center booking_time')
   .exec()
   .then(doc => {
     console.log("From database", doc);
     if (doc) 
     {
       res.status(200).json({
         count: doc.length,
           LAST_BOOKED_SCHEDULE:doc
       });
     }
      else {
       res
         .status(404)
         .json({ message: "No booking found for provided email" });
     }
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({ error: err });
   });
});





//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS
//http://localhost:3000/package/getbydate/
//

router.post("/getbydate", (req, res, next) =>
  {
    const schedule = req.body.schedule;
   //find the details of users booked schedule for a particular class
   Package.find({date: {$eq: schedule} })
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




//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS [SCHEDULE + CENTER]
//http://localhost:3000/package/date/

router.post("/date", (req, res, next) =>
  {
    const schedule = req.body.schedule;
    const place = req.body.place;

Package.find({date: {$eq: schedule} , center:{$eq: place}})
.select("email date slot center")
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


//get data of CURRENT DAY(TODAYS) ATTENDANCE OF ALL USERS [SCHEDULE + CENTER + SLOT]
//http://localhost:3000/package/dateslot/

router.post("/dateslot", (req, res, next) =>
  {
    const schedule = req.body.schedule;
    const place = req.body.place;
    const time = req.body.time;

Package.find({date: {$eq: schedule} , center:{$eq: place}, slot:{$eq: time}})
.select("email date slot center")
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


//to get all booked schedules BASED ON SLOT (=>  complete booking details PARTICULAR SLOT)
//http://localhost:3000/package/slot/

router.get("/slot/:userSlot", (req, res, next) => {
  slot =req.params.userSlot;
  Package.find({slot})
    .select('email id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided slot" });
      }
      
    })
    .catch
    (err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


//to get all booked schedules BASED ON DATE (=> complete booking details PARTICULAR DATE)
//http://localhost:3000/package/date/

router.get("/date/:userDate", (req, res, next) => {
  date =req.params.userDate;
  Package.find({date})
    .select('email id date slot center booking_time')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) 
      {
        res.status(200).json({
          TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
            ALL_BOOKING_DETAILS_OF_USER: doc
        });
      }
       else {
        res
          .status(404)
          .json({ message: "No booking found for provided date" });
      }
      
    })
    .catch
    (err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



//to get all booked schedules BASED ON TODAYS DATE 
//http://localhost:3000/package/datee/


router.get("/datee/", (req, res, next) => {
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
  Package.find({date: {$eq: today}})
      .select('email id date slot center booking_time')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) 
        {
          res.status(200).json({
            TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS: doc.length,
              ALL_BOOKING_DETAILS_OF_USER: doc
          });
        }
         else {
          res
            .status(404)
            .json({ message: "No booking found" });
        }
        
      })
      .catch
      (err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
  

  
  //to get all booked schedules BASED ON TODAYS DATE + CENTRE = JAYANAGAR + SLOT =1
  //http://localhost:3000/package/today/date/
  
  
  router.get("/today/date/", (req, res, next) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    const place = "jayanagar"
    const time = "1"
    Package.find({date: {$eq: today},center: {$eq: place},slot: {$eq: time}})
      //Package.find({date})
        .select('email id date slot center booking_time')
        .exec()
        .then(doc => {
          console.log("From database", doc);
          if (doc) 
          {
            res.status(200).json({
              TOTAL_COUNT_OF_BOOKINGS_BY_ALL_USERS_FOR_TODAY: doc.length,
                ALL_BOOKING_DETAILS_OF_USER: doc
            });
          }
           else {
            res
              .status(404)
              .json({ message: "No booking found" });
          }
          
        })
        .catch
        (err => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    });
    
  
  
  
  //to get all booked schedules BASED ON TODAYS DATE 
  //http://localhost:3000/package/datee/
  
  
  router.get("/today/datee/", (req, res, next) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const place = "jayanagar"
    const time = "2"
    Package.find({date: {$eq: today},center: {$eq: place},slot: {$eq: time}})
      //Package.find({date})
        .select('email id date slot center booking_time')
        .exec()
        .then(doc => {
          console.log("From database", doc);
          if (doc) 
          {
            res.status(200).json({
              TOTAL_COUNT_OF_BOOKINGS_BY_ALL_USERS_FOR_TODAY: doc.length,
                ALL_BOOKING_DETAILS_OF_USER: doc
            });
          }
           else {
            res
              .status(404)
              .json({ message: "No booking found" });
          }
          
        })
        .catch
        (err => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    });
    

    


module.exports = router;