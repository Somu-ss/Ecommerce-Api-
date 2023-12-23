const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbID');

const createCoupon = asyncHandler(async(req,res)=>{
    let coupon
    const couponCreate = req.body
    try {
        coupon = await Coupon.create(couponCreate)
        res.json(coupon)
    } catch (error) {
        console.log((error));
    }
})

const updateCoupon = asyncHandler(async(req,res)=> {
    let coupon
    const cId = req.params.id
    const {name,expiry,discount} = req.body
    validateMongoDbId(cId)
    try {
        coupon = await Coupon.findByIdAndUpdate(cId,{
            name: name,
            expiry: expiry,
            discount: discount
        },{new:true})

        res.json(coupon)
    } catch (error) {
        console.log(error);
    }
})

const getallCoupons = asyncHandler(async(req,res)=>{
    let coupon
    try {
        coupon = await Coupon.find()
        res.json(coupon)
    } catch (error) {
        console.log((error));
    }
})

const getSingleCoupon = asyncHandler(async(req,res)=>{
    let coupon
    const cId = req.params.id
    validateMongoDbId(cId)
    try {
        coupon = await Coupon.findById(cId)
        res.json(coupon)
    } catch (error) {
        console.log((error));
    }
})

const deleteCoupon = asyncHandler(async(req,res)=>{
    let coupon
    const cId = req.params.id
    validateMongoDbId(cId)
    try {
        coupon = await Coupon.findByIdAndDelete(cId)
        res.json(coupon)
    } catch (error) {
        console.log((error));
    }
})

module.exports = {createCoupon,updateCoupon,getallCoupons,getSingleCoupon,deleteCoupon}