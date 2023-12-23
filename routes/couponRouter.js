const express = require('express');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlware');
const { createCoupon, getallCoupons, getSingleCoupon, updateCoupon, deleteCoupon } = require('../controller/couponController');

const router = express.Router()

//Create Coupon
router.post('/create', authMiddleware ,isAdmin,  createCoupon)

//Get All Coupons
router.get('/', getallCoupons)

//get Single Coupons
router.get('/:id', getSingleCoupon)

//update coupon
router.put('/update/:id',authMiddleware,isAdmin,updateCoupon)

//Delete Coupon
router.delete('/delete/:id',authMiddleware,isAdmin, deleteCoupon)

module.exports = router