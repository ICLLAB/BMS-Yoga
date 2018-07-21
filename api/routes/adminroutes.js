const express = require("express");
const router = express.Router();
const body = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");


//.env

const dotenv = require("dotenv");

require('dotenv').config()
jwt_key: process.env.JWT_KEY


//time updation

var minuteFromNow = function(){
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};




////API TO EDIT ADMIN PROFILE BASED ON ID

router.put("/:adminId", (req, res, next) => {
  const id = req.params.adminId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Admin.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json({
          message: 'admin details updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/admin/'+ id
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





//API TO GET ALL ADMIN PROFILE

router.get("/", (req, res, next) => {
  Admin.find()
 .select("_id email username f_name m_name l_name phone creation_time lastLogin")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      admin: docs.map(doc => {
        return {
          admin_details: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/admin/"+ doc._id   
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





//API TO GET ADMIN PROFILE BASED ON ID

router.get("/:adminId", (req, res, next) => {
  const id = req.params.adminId;
  Admin.findById(id)
    .select('_id username f_name m_name l_name phone creation_time lastLogin')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            admin_details: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/admin'
            }
        });
      } else 
      {
        res
          .status(404)
          .json({ message: "No admin found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


/*

//API TO ADD ADMIN PROFILE

router.post("/signup", (req, res, next) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then(admin => {
      if (admin.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else 
      {  
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              phone:req.body.phone,
              username:req.body.username,
              f_name: req.body.f_name,
              m_name: req.body.m_name,
              l_name: req.body.l_name,
            });
            admin.password = bcrypt.hashSync(req.body.password, 10);
            admin.save()
              .then(result => {
                console.log(result),
                Admin.update({email:req.body.email},{$set : { creation_time : minuteFromNow()}},function(err) {
                    if(err) 
                    {
                       throw err;
                    }
                   } )
                res.status(201).json({
                  message: "ADMIN PROFILE CREATED"
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


*/

//API TO LOGIN ADMIN PROFILE

router.post("/login", (req, res, next) => {
    Admin.find({ email: req.body.email })
    .exec()
    .then(admin => {
      if (admin.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const success_token = jwt.sign
          (
            {
              email: admin[0].email,
              adminId: admin[0]._id
            },
           process.env.JWT_KEY,
            {
                expiresIn: "1h"
            });
           if (result) {
            Admin.update({email:req.body.email},{$set : { lastLogin : minuteFromNow()}},function(err) {
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




//API TO DELETE ADMIN PROFILE
router.delete("/:adminId", (req, res, next) => {
  const id = req.params.adminId;
  Admin.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'ADMIN profile deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/admin',
              
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




module.exports = router;



