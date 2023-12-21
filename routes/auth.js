const express = require('express')
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, resetPassword, updatePassword, forgetPasswordToken } = require('../controller/userController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlware')

const router = express.Router()

//Create a User or Admin Account
router.post("/register", createUser)

//Login a User
router.post("/login", loginUser)

//Fetch All Users
router.get('/all-users', getAllUsers)

//RefreshToken
router.get('/refresh', handleRefreshToken)

//Fetch a Single User
router.get('/:id',authMiddleware, getUser)

//Logout User
router.put('/logout', logoutUser)

//Update a User's Information
router.put('/update/:id',authMiddleware, updateUser)

//Delete a User
router.delete('/:id',authMiddleware, deleteUser)

//Update Password Password
router.put('/update-password',authMiddleware,updatePassword)

//Forgot Password Token Generation 
router.post('/forgot-password-token', forgetPasswordToken)

//Password Reset
router.put('/reset-password/:id', resetPassword)

//Admin Access only Routes
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)

router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)

module.exports = router

