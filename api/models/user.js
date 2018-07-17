const mongoose = require('mongoose');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt'),
Schema = mongoose.Schema;


var minuteFromNow = function(){
    var d = new Date();
     d.setHours(d.getHours() + 5);
   d.setMinutes(d.getMinutes() + 30);
     var n = d.toLocaleString();
   return n;
  };

  
//PATIENT/ASPIRANT REQUIREMENTS
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
    reset_password_token: {type: String},
    reset_password_expires: {type: Date}
});


userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('User', userSchema);

