const mongoose = require('mongoose');


var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 0);
   d.setMinutes(d.getMinutes() + 0);
     var n = d.toLocaleString();
   return n;
  };


const packageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //email: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, ref: 'User',required: true },
    date:{type: Date,required:true},
    center:{type: String,required:true},
    slot :{type: Number,required:true},
    booking_time : { type : String, default: minuteFromNow }
});

module.exports = mongoose.model('Package', packageSchema);

