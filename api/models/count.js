const mongoose     = require('mongoose');



var minuteFromNow = function()
{
  var d = new Date();
   d.setHours(d.getHours() + 5);
 d.setMinutes(d.getMinutes() + 30);
   var n = d.toLocaleString();
 return n;
};

const countSchema   = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    attendance: { type: String, ref: 'Attendance', required: true },
    date: {type:Date,required:true},
    //zdate: {type:Date,required:true}
});

module.exports = mongoose.model('Count', countSchema);
