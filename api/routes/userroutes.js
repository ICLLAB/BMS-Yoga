const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");

require('dotenv').config()
jwt_key: process.env.JWT_KEY
mail_key :process.env.MAIL_KEY



var minuteFromNow = function(){
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};


router.get("/", (req, res, next) => {
  User.find()
  .select("_id username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      user: docs.map(doc => {
        return {
          _id: doc._id,
          username: doc.username,
          f_name: doc.f_name,
          m_name:doc.m_name,
          l_name: doc.l_name,
          phone : doc.phone,
          weight: req.body.weight,
          height: req.body.height,
          phone: req.body.phone,
          medical_con: req.body.medical_con,
          pain_areas: req.body.pain_areas,
          medications: req.body.medications,
          experience: req.body.experience,
          creation_time: doc.creation_time,
          lastLogin : doc.lastLogin,
          request: {
            type: "GET",
            url: "http://localhost:3000/user/"+ doc._id   
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



router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('_id username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user_details: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/user'
            }
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







router.put("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json({
          message: 'user details updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/user/'+ id
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



router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              phone:req.body.phone,
              username:req.body.username,
              f_name: req.body.f_name,
              m_name: req.body.m_name,
              l_name: req.body.l_name,
              weight: req.body.weight,
              height: req.body.height,
              phone: req.body.phone,
              medical_con: req.body.medical_con,
              pain_areas: req.body.pain_areas,
              medications: req.body.medications,
              experience: req.body.experience
              
            });
            user
              .save()
              .then(result => {
                console.log(result),
                User.update({email:req.body.email},{$set : { creation_time : minuteFromNow()}},function(err) {
                    if(err) 
                    {
                       throw err;
                    }
                   } )
                res.status(201).json({
                  message: "User created"
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
      }
    });
});

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
          const token = jwt.sign
          (
            {
              email: user[0].email,
              userId: user[0]._id
            },
          //  "secret",
           process.env.JWT_KEY,
            //process.env.secret,
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
          return res.status(200).json({
            message: "Auth successful",
           token: token
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
router.get('/logout', function(req, res) {
  req.token.destroy();
  return res.status(200).send();
});






router.get('/lsogout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

*/


router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/user',
              
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
/*


router.put("/:userId", (req, res, next) => {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body)
  .then(function(){
    User.findOne({_id:req.params.id})
    .then(function(user)
    {
      res.send(user);
    });
  });
});
    
*/












// forgot password


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
        console.log('error', 'No account with that email address exists.');
     //     return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'noreply.iclbmsce@gmail.com',
          pass: process.env.MAIL_KEY
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noreply.iclbmsce@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        console.log('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    console.log("dfjdgfjkhjg")
   // res.redirect('/forgot');
  });
});
/*
router.get('reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log('error', 'Password reset token is invalid or has expired.');
      //return res.redirect('/forgot');
    }
   // res.render('reset', {token: req.params.token});
  });
});
*/

router.post('reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
       
        if(req.body.password === req.body.confirm) {
          User.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })

                  
        } else {
          console.log("error", "Passwords do not match.");
         //   return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'noreply.iclbmsce@gmail.com',
          pass: process.env.MAIL_KEY
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noreply.iclbmsce@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    //res.redirect('/campgrounds');
  });
});



module.exports = router;