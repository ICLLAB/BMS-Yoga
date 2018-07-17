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
const dotenv = require("dotenv");
//hbs = require('nodemailer-express-handlebars'),
email = process.env.MAILER_EMAIL_ID || 'noreply.iclbmsce@gmail.com',
pass = process.env.MAILER_PASSWORD || 'bms-icl123',

module.exports = router;
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

//udemy
/*
router.put("/:userId", (req, res, next) => {
  const id = req.params.userId;
 
 User.findOneAndUpdate({
  _id: id }, {
   $set:{
     fname: req.body.f_name
     }
   },{
     returnOriginal: false
   })
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

*/



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






router.get("/", (req, res, next) => {
  User.find()
 .select("_id email username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      user: docs.map(doc => {
        return {
          user_details: doc,
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


// FIND BY MAIL
/*
router.get("/:userEmail", (req, res, next) => {
  const email = req.params.userEmail;
  User.find({ email: req.body.email })
    .select('_id email username f_name m_name l_name phone weight height medical_con pain_areas medications experience creation_time lastLogin')
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

*/



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
             // password: hash,
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
          const success_token = jwt.sign
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


router.get('/logout', (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
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

















const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

/*
const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./api/templates/'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));



*/


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

        subject: 'Password help has arrived!',
        text: 'Click to reset Token :  http://localhost:3000/user/reset/' + token
        
      };
     console.log(token);
      
      //console.log("to  : "+this.test)
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


/**
 * Reset password
 */


router.post("/reset/:token", (req, res, next) => {
  User.findOne({
    reset_password_token: req.params.token,
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
              context: {
             
              }
            };

            smtpTransport.sendMail(data, function(err) {
              if (!err) {
                return res.json({ message: 'Password reset' });
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



