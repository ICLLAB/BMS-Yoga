const express = require("express");
const router = express.Router();
//const moment = require('moment');
const mongoose = require('mongoose');

const Attendance = require('../models/attendance');

// time of attendance taken

var minuteFromNow = function()
{
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};




//ADD PATIENT/ASPIRANT TO ATTENDANCE TAB

router.post("/markattendance", (req, res, next) => {
  Attendance.find({ email: req.body.email })
    .exec()
    .then(attendance => {
      if (attendance.length >= 1) {
        return res.status(409).json({
          message: "EMAIL ALREADY EXISTS"
        });
      }  else {
           
        
        
        
        
        
        Attendance.create(req.body, function (err, post) {
          if (err) {
            res.send(err);
            }
            res.send(post);
          });
        
        
        
        
        
        /*
        
        
        const attendance = new Attendance({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email
              //package: req.body.package,
              //attendance_count:req.body.attendance_count
            });


            */
            attendance
              .save()
              .then(result => {
                console.log(result);
                
                res.status(201).json({
                  message: "NAME REGISTERED IN ATTENDANCE TAB"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
    });
});



module.exports = router;





