const mongoose     = require('mongoose');



var minuteFromNow = function()
{
  var d = new Date();
   d.setHours(d.getHours() + 0);
 d.setMinutes(d.getMinutes() + 0);
   var n = d.toLocaleString();
 return n;
};

const attendanceSchema   = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true},
    //package: {type: Number, required: true},
    //allDay: {type: Boolean, required: false},
    //start: {type: Date,required:false},
    //end: {type:Date,required:false},
   // attendance_count :{type: Number, default: 0},
    lastLogin :{ type : String, default: minuteFromNow}
});

module.exports = mongoose.model('Attendance', attendanceSchema);
