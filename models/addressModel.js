const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var AddressSchema = new mongoose.Schema({
    doorno:{
        type:String,
        required:true,
    },
    area:{
        type:String,
        required:true,
    },
    landmark:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"    
    }
});

//Export the model
module.exports = mongoose.model('Address', AddressSchema);