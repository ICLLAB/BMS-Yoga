const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 0);
   d.setMinutes(d.getMinutes() + 0);
     var n = d.toLocaleString();
   return n;
  };


const Tip = require("../models/tip");

router.get("/", (req, res, next) => {
  //TO GET LAST UPDATED HEALTH TIP
    Tip.find().sort({"creation_time": -1}).limit(1)
    .select("health_tip type")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tip: docs.map(doc => {
          return {
            health_tip: doc.health_tip,
            type: doc.type,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/tip/"+ doc._id
              
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



router.post("/", (req, res, next) => {
  const tip = new Tip({
   // _id: new mongoose.Types.ObjectId(),
    health_tip: req.body.health_tip,
    type: req.body.type
 
    
  });
  tip
    .save()
    .then(result => {
      console.log(result),
      Tip.update({health_tip:req.body.health_tip},{$set : { creation_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } )
      res.status(201).json({
        message: "tip added successfully",
        createdTip: {
            health_tip: result.health_tip,
            type: result.type,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/tip/" + result._id,
            }
            
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

router.get("/:tipId", (req, res, next) => {
  const id = req.params.tipId;
  Tip.findById(id)
    .select('health_tip type _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            tip: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/tip'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid health tip found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/:tipId", (req, res, next) => {
  const id = req.params.tipId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Tip.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
      console.log(result),
      Tip.update({health_tip:req.body.health_tip},{$set : { creation_time : minuteFromNow()}},function(err) {
        if(err) 
        {
           throw err;
        }
       } ) 
      res.status(200).json({
          message: 'tip details updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/tip/'+ id
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

router.delete("/:tipId", (req, res, next) => {
  const id = req.params.tipId;
  Tip.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'health tip deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/tip',
              
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