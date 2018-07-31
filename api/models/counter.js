const mongoose = require('mongoose');

var minuteFromNow = function()
{
  var d = new Date();
   d.setHours(d.getHours() + 0);
 d.setMinutes(d.getMinutes() + 0);
   var n = d.toLocaleString();
 return n;
 
};

const counterSchema   = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //user: { type: String, ref: 'Package'},
    email: { type: String, ref: 'Package', required: true },
    date: {type:Date,required:true},
    center: {type:String,required:true},
    slot:{type:String,required:true}
});

module.exports = mongoose.model('Counter', counterSchema);
