const express = require('express')
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, resetPassword, updatePassword, forgetPasswordToken, loginAdmin, getWishlist, getAddress, createAddress, updateAddress, deleteAddress } = require('../controller/userController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlware')

const router = express.Router()

//Create a User or Admin Account
router.post("/register", createUser)

//Login a User
router.post("/login", loginUser)

//Login Admin
router.post("/admin-login", loginAdmin)

//Fetch All Users
router.get('/all-users', getAllUsers)

//RefreshToken
router.get('/refresh', handleRefreshToken)

//get Wishlist Products
router.get('/get-wishlist', authMiddleware, getWishlist)

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

//create Address
router.post('/address/create',authMiddleware, createAddress)

//update Address
router.put('/address/update/:id',authMiddleware, updateAddress)

//delete Address
router.delete('/address/delete/:id', authMiddleware, deleteAddress)

//Admin Access only Routes
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)

router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)


module.exports = router

