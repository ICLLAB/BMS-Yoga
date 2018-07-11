const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Trainer = require("../models/trainer");


var minuteFromNow = function(){
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};




router.get("/", (req, res, next) => {
  Trainer.find()
  .select("_id username f_name m_name l_name phone creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      trainer: docs.map(doc => {
        return {
          _id: doc._id,
          username: doc.username,
          f_name: doc.f_name,
          m_name:doc.m_name,
          l_name: doc.l_name,
          phone : doc.phone,
          creation_time: doc.creation_time,
          lastLogin : doc.lastLogin,
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



router.get("/:trainerId", (req, res, next) => {
  const id = req.params.trainerId;
  Trainer.findById(id)
    .select('_id username f_name m_name l_name phone creation_time lastLogin')
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









router.post("/signup", (req, res, next) => {
    Trainer.find({ email: req.body.email })
  //checking if email exists in db already
    .exec()
    .then(trainer => {
      if (trainer.length >= 1) {
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
            const trainer = new Trainer({
              _id: new mongoose.Types.ObjectId(),
              f_name:req.body.f_name,
              m_name:req.body.m_name,
              l_name:req.body.l_name,
              username:req.body.username,
              email: req.body.email,
              phone:req.body.phone,
              password: hash,
              
              
            });
            trainer
              .save()
              .then(result => {
                console.log(result),
                Trainer.update({email:req.body.email},{$set : { creation_time : minuteFromNow()}},function(err) {
                  if(err) 
                  {
                     throw err;
                  }
                 } )
                res.status(201).json({
                  message: "trainer profile created"
                  
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




router.post("/login", (req, res, next) => {
    Trainer.find({ email: req.body.email })
      .exec()
      .then(trainer => {
        if (trainer.length < 1) {
          return res.status(401).json({
            message: "LOGIN FAILED"
          });
        }
        //comaprision with existing mails==pwd in db
        bcrypt.compare(req.body.password, trainer[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "LOGIN FAILED"
            });
          }
          if (result) {
            Trainer.update({email:req.body.email},{$set : { lastLogin : minuteFromNow()}},function(err) {
                if(err) 
                {
                   throw err;
                }
               } )
            return res.status(200).json({
              message: "LOGIN SUCCESSFUL",
            });
          }
          res.status(401).json({
            message: "LOGIN FAILED"
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
  module.exports = router;
