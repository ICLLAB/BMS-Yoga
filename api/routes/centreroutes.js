const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Centre = require("../models/centre");



router.get("/", (req, res, next) => {
    Centre.find()
   .select("_id place")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        centre: docs.map(doc => {
          return {
            CENTRE_DETAILS: doc
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
  const centre = new Centre({
    place: req.body.place
 
    
  });
  centre
    .save()
    .then(result => {
      console.log(result),
     res.status(201).json({
        message: "centre added successfully",
        CENTRE_CREATED: {
            place: result.place,
            _id: result._id,
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


router.delete("/:centreId", (req, res, next) => {
  const id = req.params.centreId;
  Centre.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'centre deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/centreId',
              
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