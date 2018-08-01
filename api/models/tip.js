const mongoose = require('mongoose');


var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };

  const tipSchema = mongoose.Schema({
    //_tid: mongoose.Schema.Types.ObjectId,
    type: { type: String, required: true },
    health_tip: { type: String, required: true },
    creation_time : { type : String, default: minuteFromNow }
    
});

module.exports = mongoose.model('Tip', tipSchema);

