const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
Schema = mongoose.Schema;

var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };


const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: 
    { 
        type: String, 
        required: true, 
        unique: true,
        //email regex (email validation)
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    f_name: { type: String, required: false },
    m_name: { type: String, required: false },
    l_name: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: false },
    creation_time : { type : String, default: minuteFromNow },
    lastLogin :{ type : String, default: minuteFromNow },
   
});


module.exports = mongoose.model('Admin', adminSchema);

