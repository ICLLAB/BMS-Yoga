const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const dotenv = require("dotenv");

var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
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
    weight: { type: Number, required: false },
    height: { type: Number, required: false },
    phone: { type: Number, required: false },
    medical_con: { type: String, required: false },
    pain_areas: { type: String, required: false },
    medications: { type: String, required: false },
    experience: { type: String, required: false },
    creation_time : { type : String, default: minuteFromNow },
    lastLogin :{ type : String, default: minuteFromNow },
    resetPasswordToken:{ type: String },
    resetPasswordExpires:{type:Date}

});

module.exports = mongoose.model('User', userSchema);

