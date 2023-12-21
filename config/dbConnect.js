const mongoose = require('mongoose')
const dotenv = require('dotenv')

const dbConnect = ( ) =>{
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect;