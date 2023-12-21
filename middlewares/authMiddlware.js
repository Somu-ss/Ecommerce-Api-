const User = require('../models/userModel')
const jwtToken = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async(req,res,next)=>{
    let token;
    
        if(req?.headers?.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            try {
                let decoded;
                let user;
                if(token){
                    decoded = jwtToken.verify(token, process.env.JWT_SECRET);
                    user = await User.findById(decoded?.id)
                    req.user = user;
                    next()
                }
                
            } catch (error) {
                return res.json('Not Authorized Token Expired, Login to get Another Token')
            }
        
        
        } else {
            return res.json('There is no token attached to the Header')
        }
})

const isAdmin = asyncHandler(async(req,res,next) => {
    const email = req.user;
    let adminUser;
    try {
        adminUser = await User.findOne(email);
        if(adminUser.role !== "admin"){
            res.json("You Don't Have Admin Access")
        } else {
            next()
        }
    } catch (error) {
        return console.log(error);
    }
})

module.exports = {authMiddleware, isAdmin}; 