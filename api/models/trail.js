const mongoose = require('mongoose');


var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };


const trailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, ref: 'User' ,required: true},
    //user: { type: String, ref: 'User'},
    date:{type: Date,required:true},
    center:{type: String,required:true},
    slot :{type: Number,required:true},
    booking_time : { type : String, default: minuteFromNow }

});

module.exports = mongoose.model('Trail', trailSchema);

