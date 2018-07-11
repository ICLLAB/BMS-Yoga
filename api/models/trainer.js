const mongoose = require('mongoose');



var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };


  
//TRAINER REQUIREMENTS
const trainerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        //email regex (email validation)
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    f_name: { type: String, required: true },
    m_name: { type: String, required: false },
    l_name: { type: String, required: false },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    creation_time : { type : String, default: minuteFromNow },
    lastLogin :{ type : String, default: minuteFromNow }


});

module.exports = mongoose.model('Trainer', trainerSchema);

