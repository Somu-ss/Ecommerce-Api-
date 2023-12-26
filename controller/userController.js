const generateToken = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbID');
const generateRefreshToken = require('../config/refrestToken');
const sendEmail = require('../controller/emailcontroller')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { log } = require('console');
const Address = require('../models/addressModel')


//Register a User
const createUser = asyncHandler(async(req,res) => {
    let findUser
    const email = req.body.email
    try {
        findUser = await User.findOne({email: email})
        if(!findUser){
            try {
                const newUser = await User.create(req.body);
                // res.status(201).json({message : newUser})
                res.json(newUser)
            } catch (error) {
                console.log(error)
            }
        }else{
            res.status(409).json("User Already Exists")
        }
        
    } catch (error) {
        console.log(error);
    }
    
});

//Login User
const loginUser = asyncHandler(async(req,res) => {
    let findUser;
    const email = req.body.email
    const password = req.body.password
    try {
        let refreshToken;
        let updateRefreshToken;
        findUser = await User.findOne({email:email})
        if(findUser && (await findUser.isPasswordCorrect(password))){
            refreshToken = generateRefreshToken(findUser?._id)
            updateRefreshToken = await User.findByIdAndUpdate(findUser._id, {
                refreshToken: refreshToken
            },{
                new: true
            })
            res.cookie("refreshToken", refreshToken,{
                httpOnly: true,
                maxAge: 72*60*60*1000
            })
            res.status(200).json({
                _id: findUser?._id,
                firstname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                role: findUser?.role,
                token: generateToken(findUser?._id)
            })

        }else{
            return res.status(409).json("Invalid Credentials")
        }
    } catch (error) {
        console.log(error);
        
    }
})


//Login User
const loginAdmin = asyncHandler(async(req,res) => {
    let findAdmin;
    const email = req.body.email
    const password = req.body.password
    try {
        let refreshToken;
        let updateRefreshToken;
        findAdmin = await User.findOne({email:email})
        if(findAdmin.role !== "admin") { res.status(401).json("You Are Not Authorized")}
        if(findAdmin && (await findAdmin.isPasswordCorrect(password))){
            refreshToken = generateRefreshToken(findAdmin?._id)
            updateRefreshToken = await User.findByIdAndUpdate(findAdmin._id, {
                refreshToken: refreshToken
            },{
                new: true
            })
            res.cookie("refreshToken", refreshToken,{
                httpOnly: true,
                maxAge: 72*60*60*1000
            })
            res.status(200).json({
                _id: findAdmin?._id,
                firstname: findAdmin?.firstname,
                lastname: findAdmin?.lastname,
                email: findAdmin?.email,
                mobile: findAdmin?.mobile,
                role: findAdmin?.role,
                token: generateToken(findAdmin?._id)
            })

        }else{
            return res.status(409).json("Invalid Credentials")
        }
    } catch (error) {
        console.log(error);
        
    }
})

//Get All User
const getAllUsers = asyncHandler(async(req,res)=>{
    let getUsers;
    try {
        getUsers = await User.find()
        res.status(200).json(getUsers)

    } catch (error) {   
        return console.log(error);
        
    }
})

//Get a Single User
const getUser = asyncHandler(async(req,res)=>{
    let getUser;
    const userId = req.params.id
    validateMongoDbId(userId)
    try {
        getUser =  await User.findById(userId)
        res.json(getUser)
        
    } catch (error) {
        return console.log(error)
    }
})

//Update User
const updateUser = asyncHandler(async(req,res)=>{
    let updatedUser; 
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname:  req?.body?.lastname,
            mail: req?.body?.email,
            mobile: req?.body?.mobile,
        },{new: true});

        res.json(updatedUser)
    } catch (error) {
        return console.log(error);
    }
})

//Delete a User
const deleteUser = asyncHandler(async(req,res)=>{
    let getUser;
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        getUser =  await User.findByIdAndDelete(_id)
        res.status(400).json("Succesfully Deleted")
        
    } catch (error) {
        return console.log(error);
    }
})

//Handle refresh Token
const handleRefreshToken = asyncHandler(async(req,res)=>{
    let user
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("Refresh Token Not Found in Cookies")
    }
    const refreshToken = cookie.refreshToken
    try {
        user = await User.findOne({refreshToken})
        if(!user){
            throw new Error('The Refresh Token is not found in Db or Not Matched')
        }
        jwt.verify(refreshToken,process.env.JWT_SECRET, (err, decoded)=> {
            if(err || user.id !== decoded.id){
                throw new Error('There is something wrong with the Refresh Token')
            }
            const accessToken = generateToken(user._id)
            res.json({accessToken})
        })

        

    } catch (error) {
        return console.log(error);
        
    }
})

//Logout
const logoutUser = asyncHandler(async(req,res)=>{
    let user
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("Refresh Token Not Found in Cookies")
    }
    const refreshToken = cookie.refreshToken
    try {
        user = await User.findOne({refreshToken})
        if(!user){
            res.clearCookie("refreshToken",{
                httpOnly: true,
                secure: true
            })
            return res.status(203) //forbidden
        }
        await User.findByIdAndUpdate(user.id, {
            refreshToken: " "
        })
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true
        })
        res.status(204).json("Logout Succesfull")
        
    } catch (error) {
        return console.log(error);
        
    }
})

//Admin can Block a user
const blockUser = asyncHandler(async(req,res) =>{
    let blockUser;
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        blockUser = await User.findByIdAndUpdate(_id, {
            isblocked: true
        },{
            new:true
        })
        res.status(200).json('User Blocked  ' + blockUser.isblocked)
    } catch (error) {
        return console.log(error);
        
    }
});

//Admin can UnBlock a User
const unblockUser = asyncHandler(async(req,res) =>{
    let unBlockUser;
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        unBlockUser = await User.findByIdAndUpdate(_id, {
            isblocked: false
        },{
            new:true
        })
        res.status(200).json('User UnBlocked ' + unBlockUser.isblocked)
    } catch (error) {
        return console.log(error);
        
    }
});

//reset Password
const updatePassword =asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    const password = req.body.password;
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if(password){
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    }
    else{
        res.status(400).json(user)
    }
})

const forgetPasswordToken = asyncHandler(async(req,res)=>{
    let user;
    let token;
    let resetURL
    const email = req.body.email;
    user = await User.findOne({email})
    if(!user) { throw new Error("User cannot be found with this Email ID")}
    try {
        token = await user.passwordResetTokens()
        user.save();
        const resetURL = `Hello, Please follow the below Link to Reset Your Password. This Link will Automatically Expire within 10 minutes. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here to Reset Password</a>` 
        const data = {
            to: req.body.email,
            text: "hello" + user.firstname,
            subject: "Password Reset Link",
            htm: resetURL
        }
        sendEmail(data)
        res.json(user)
        
    } catch (error) {
        return console.log(error);
    }
})

const resetPassword = asyncHandler(async(req,res)=> {
    let user;
    const password  = req.body.password;
    const token  = req.params.id;
    console.log(password);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    user = await User.findOne({
        PasswordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    if(!user){ throw new Error(" Token is Expired, Try Again After Some Time")}
    user.password = password;
    user.PasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    res.json(user)
})

const getWishlist = asyncHandler(async(req,res)=>{
    let wishlist
    const {_id} = req.user
    validateMongoDbId(_id)
    
    try {
        console.log(_id);
        wishlist = await User.findById(_id).populate('wishlist')
        res.json({
                _id: wishlist?._id,
                firstname: wishlist?.firstname,
                lastname: wishlist?.lastname,
                email: wishlist?.email,
                mobile: wishlist?.mobile,
                role: wishlist?.role,
                wishlist:  wishlist?.wishlist
        })
    } catch (error) {
        return console.log(error);
    }

})

const createAddress = asyncHandler(async(req,res)=>{
    let address
    let userAddress
    const createAddress= req.body;
    const userId = req.user._id
    try {
        console.log(createAddress);
        const user = await User.findById(userId)
        address = await Address.create(createAddress)
        const alreadyexist = user.address.find((id)=> id.toString() === address.id)

        console.log(alreadyexist);
        if(alreadyexist){
            userAddress = await User.findByIdAndUpdate(userId,{
                $pull:{address: address.id}
            },{new:true}).populate("address")
            res.status(200).json(userAddress)

        }else{
            userAddress = await User.findByIdAndUpdate(userId,{
                $push:{address: address.id}
            },{new:true}).populate("address")
            res.status(200).json(userAddress)
        }
    

    } catch (error) {
        console.log(error);
    }
})

const updateAddress = asyncHandler(async(req,res)=>{
    let address
    let user
    const userId = req.user._id
    const addId = req.params.id
    const updateAddress = req.body
    try {
        address = await Address.findByIdAndUpdate(addId,{
            doorno: updateAddress?.doorno,
            area: updateAddress?.area,
            landmark: updateAddress?.landmark,
            city: updateAddress?.city,
            state: updateAddress?.state,
        },{new:true})
        user = await User.findById(userId).populate('address')
        res.json(user)

    } catch (error) {
        return console.log(error);
    }
})

const deleteAddress = asyncHandler(async(req,res)=>{
    let address
    let user
    const userId = req.user._id
    const addId = req.params.id
     try {
        address = await Address.findByIdAndDelete(addId)
        user = await User.findById(userId).populate('address')
        res.json(user)

    } catch (error) {
        return console.log(error);
    }
})
module.exports = {createUser,
      loginUser, getAllUsers, getUser, deleteUser,
      updateUser,blockUser,unblockUser,handleRefreshToken,
      logoutUser,updatePassword, forgetPasswordToken,
      resetPassword,loginAdmin,getWishlist,createAddress, updateAddress,deleteAddress};