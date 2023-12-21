const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { mongo } = require('mongoose');
const crypto = require('crypto')
const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        minLength: 10
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: "user"
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: mongoose.Types.ObjectId,
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
    passwordChangedAt: Date,
    PasswordResetToken: String,
    passwordResetExpires: Date
},{
    timestamps: true
});


userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
});

userSchema.methods.isPasswordCorrect = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.passwordResetTokens = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.PasswordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now()+30*60*1000
    return resetToken
}

//Export the model
module.exports = mongoose.model('User', userSchema);