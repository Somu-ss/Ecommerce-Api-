const mongoose = require('mongoose')

const validateMongoDbId = (id) => {
    let valid;
    valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        throw new Error("this ID is not Valid or Not Found")
    }
}

module.exports = validateMongoDbId