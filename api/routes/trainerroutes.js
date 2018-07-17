const express = require("express");
const router = express.Router();
const body = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


//env
const dotenv = require("dotenv");

email = process.env.MAILER_EMAIL_ID,
pass = process.env.MAILER_PASSWORD,


require('dotenv').config()

jwt_key: process.env.JWT_KEY
mailer_email_id :process.env.MAILER_EMAIL_ID
mailer_password :process.env.MAILER_PASSWORD
mailer_service_provider:process.env.MAILER_SERVICE_PROVIDER

//time updation


var minuteFromNow = function(){
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};



//API TO EDIT TRAINER PROFILE

router.put("/:trainerId", (req, res, next) => {
  const id = req.params.trainerId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Trainer.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json({
          message: 'trainer details updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/trainer/'+ id
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





//API TO GET TRAINER PROFILE

router.get("/", (req, res, next) => {
  Trainer.find()
  .select("_id email username f_name m_name l_name phone creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      trainer: docs.map(doc => {
        return {
          trainer_details: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/trainer/"+ doc._id
            
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





//API TO GET TRAINER PROFILE(passing email)

router.get("/email/:trainerEmail", (req, res, next) => {
  const email = req.params.trainerEmail;
  Trainer.find({email})
    .select('_id email phone username f_name m_name l_name phone creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            trainer_details: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/trainer'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No trainer found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});




//API TO GET TRAINER PROFILE(passing id)

router.get("/id/:trainerId", (req, res, next) => {
  const id = req.params.trainerId;
  Trainer.findById(id)
    .select('_id email username f_name m_name l_name phone creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            trainer_details: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/trainer'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No trainer found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});













//API TO ADD TRAINER PROFILE

router.post("/signup", (req, res, next) => {
  Trainer.find({ email: req.body.email })
    .exec()
    .then(trainer => {
      if (trainer.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
         
            const trainer = new Trainer({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              phone:req.body.phone,
              username:req.body.username,
              f_name: req.body.f_name,
              m_name: req.body.m_name,
              l_name: req.body.l_name,
              
            });
            trainer.password = bcrypt.hashSync(req.body.password, 10);
              trainer.save()
              .then(result => {
                console.log(result),
                Trainer.update({email:req.body.email},{$set : { creation_time : minuteFromNow()}},function(err) {
                    if(err) 
                    {
                       throw err;
                    }
                   } )
                res.status(201).json({
                  message: "TRAINER PROFILE CREATED"
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




//API TO LOGIN TRAINER PROFILE

router.post("/login", (req, res, next) => {
  Trainer.find({ email: req.body.email })
    .exec()
    .then(trainer => {
      if (trainer.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, trainer[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        
        if (result) {
          const success_token = jwt.sign
          (
            {
              email: trainer[0].email,
              trainerId: trainer[0]._id
            },
           process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
           
          if (result) {
            Trainer.update({email:req.body.email},{$set : { lastLogin : minuteFromNow()}},function(err) {
                if(err) 
                {
                   throw err;
                }
               } )
          return res.status(200).json({
            message: "Auth successful",
           success_token: success_token
          });
        }
       }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



//API TO DELETE TRAINER PROFILE(passing id)


router.delete("/:trainerId", (req, res, next) => {
  const id = req.params.trainerId;
  Trainer.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Trainer deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/trainer',
              
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



//EAMIL CONFIGURATION

const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER ,
  auth: {
    user: email,
    pass: pass
  }
});



//API TO FORGOT PASSWORD. TRAINER PROFILE

router.post("/forgot", (req, res, next) => {
  async.waterfall([
    function(done) {
      Trainer.findOne({
        email: req.body.email
      }).exec(function(err, trainer) {
        if (trainer) {
          done(err, trainer);
        } else {
          done('TRAINER not found.');
        }
      });
    },
    function(trainer, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        const token = buffer.toString('hex');
        done(err, trainer, token);
      });
    },
    function(trainer, token, done) {
      Trainer.findByIdAndUpdate({ _id: trainer._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_trainer) {
        done(err, token, new_trainer);
      });
    },
    function(token, trainer, done) {
      var data = {
        to: trainer.email,
        from: email,

        subject: 'Password help has arrived!',
        text: 'Click to reset PASSSWORD :  http://localhost:3000/trainer/reset/' + token
        
      };
      
      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
  
}

);

//API TO RESET PATIENT/ASPIRANT PROFILE


router.post("/reset/:token", (req, res, next) => {
  Trainer.findOne({
    reset_password_token: req.params.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }
)
  .exec(function(err, trainer) {
    if (!err &&trainer) {
      
      if (req.body.newPassword === req.body.verifyPassword) {
        
        trainer.password = bcrypt.hashSync(req.body.newPassword, 10);
        trainer.reset_password_token = undefined;
        trainer.reset_password_expires = undefined;
        trainer.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var data = {
              to: trainer.email,
              from: email,
          
              subject: 'Password Reset Confirmation',
              text: 'PASSWORD RESET WAS SUCCESSFULL'
            };

            smtpTransport.sendMail(data, function(err) {
              if (!err) {
                return res.json({ message: 'Password reset SUCCESSFULL' });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      
      
      return res.status(400).send({
        
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
})


  module.exports = router;
