const mongoose = require('mongoose');


  const centreSchema = mongoose.Schema({
    place: { type: String, required: true },
 
    
});

module.exports = mongoose.model('Centre', centreSchema);

