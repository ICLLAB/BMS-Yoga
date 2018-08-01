const express = require("express");
const router = express.Router();
const body = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path');


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





//API TO EDIT PATIENT/ASPIRANT PROFILE (passing email)

router.put("/email/:userEmail", (req, res, next) => {
  const email = req.params.userEmail; 
  User.update({email}, req.body)
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json({
          message: 'user details updated'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//API TO EDIT PATIENT/ASPIRANT PROFILE (passing id)

router.put("/id/:userId", (req, res, next) => {
  const id = req.params.userId; 
  User.update({ _id: id }, req.body)
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json({
          message: 'user details updated'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});




//API TO GET PATIENT/ASPIRANT PROFILE

router.get("/", (req, res, next) => {
  User.find()
 .select("_id email username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      user: docs.map(doc => {
        return {
          user_details: doc
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


//API TO GET PATIENT/ASPIRANT PROFILE(passing email)

router.get("/email/:userEmail", (req, res, next) => {
  const email = req.params.userEmail;
  User.find({email})
    .select('_id email username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user_details: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "No user found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



//API TO GET PATIENT/ASPIRANT PROFILE(passing id)

router.get("/id/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('_id username email f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user_details: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "No user found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});




//API TO ADD PATIENT/ASPIRANT PROFILE

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
         
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              phone:req.body.phone,
              username:req.body.username,
              f_name: req.body.f_name,
              m_name: req.body.m_name,
              l_name: req.body.l_name,
              weight: req.body.weight,
              height: req.body.height,
              medical_con: req.body.medical_con,
              pain_areas: req.body.pain_areas,
              medications: req.body.medications,
              experience: req.body.experience,

              
            });
            user.password = bcrypt.hashSync(req.body.password, 10);
              user.save()
              .then(result => {
                console.log(result),
                User.update({email:req.body.email},{$set : { creation_time : minuteFromNow()}},function(err) {
                    if(err) 
                    {
                       throw err;
                    }
                   } )
                res.status(201).json({
                  message: "USER PROFILE CREATED"
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


//API TO LOGIN PATIENT/ASPIRANT PROFILE

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        
        if (result) {
          const success_token = jwt.sign
          (
            {
              email: user[0].email,
              userId: user[0]._id
            },
           process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
           
          if (result) {
            User.update({email:req.body.email},{$set : { lastLogin : minuteFromNow()}},function(err) {
                if(err) 
                {
                   throw err;
                }
               } )
              

               User.update({email:req.body.email},{tokky:success_token},function(err) {
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




/*

router.get('/logout', (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});




router.get('/logout', function(req, res) {
  req.token.destroy();
  return res.status(200).send();
});






router.get('/lsogout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

*/

//LOGOUT (DESTROY TOKEN)
router.get('/logout/:success_token', function(req, res) {
User.findOne({
  tokky: req.params.success_token
}
)
.exec(function(err, user) {
    if (!err &&user)
     {      
user.tokky = undefined;
        
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } 

          else {
    if (!err) {
                return res.json({ message: 'TOKEN DESTROYED SUCCESSFULL' });
              } 
            
          }
        });

    } 
    
  });
})
module.exports = router;


//API TO DELETE PATIENT/ASPIRANT PROFILE(passing id)

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//EMAIL CONFIGURATION

const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER,
  auth: {
    user: email,
    pass: pass
  }
});



//API TO FORGOT PASSWORD. PATIENT/ASPIRANT PROFILE

router.post("/forgot", (req, res, next) => {
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        const token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function(user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
        done(err, token, new_user);
      });
    },
    function(token, user, done) {
      var data = {
        to: user.email,
        from: email,
        subject: 'BMS-YOGA Password Reset',
        text: 'Click the below link to reset\n\n' +
        'http://' + req.headers.host + '/user/reset?token=' + token + '\n\n'
      };
     
      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          
          //return res.sendFile(path.resolve('./public/reset-password.html'));
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
});

//API TO RESET PATIENT/ASPIRANT PROFILE

router.get('/reset', function(req, res) {
  res.sendFile(path.resolve('./public/user.html'));
  //server.use(express.static(path.join(__dirname, './static')));
});

router.post("/reset", (req, res, next) => {
  User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }
)
  .exec(function(err, user) {
    if (!err &&user) {
      
      if (req.body.newPassword === req.body.verifyPassword) {
        
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var data = {
              to: user.email,
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



