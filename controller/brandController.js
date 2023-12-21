const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbID');

const createBrand = asyncHandler(async(req,res)=>{
    let brand
    let findbrand
    const brandName = req.body
    try {
         //find brand if it already exist
         findbrand = await Brand.findOne(brandName)
         //if already exist then send Dublicate entry
         if(findbrand?.title === brandName.title){ 
             res.json('brand Already Exists, Dublicate Entry')
         }
         //Create brand if it does'nt exist already
        brand = await Brand.create(brandName)
        res.status(201).json(brand)
        
    } catch (error) {
        console.log(error);
    }
})

const updateBrand = asyncHandler(async(req,res)=>{
    let brand
    const brand_Id = req.params.id 
    const brandName = req.body.title
    validateMongoDbId(brand_Id)
    try {
        brand = await Brand.findByIdAndUpdate(brand_Id, {
            title: brandName
        },{new:true})
        res.status(201).json(brand)
        
    } catch (error) {
        console.log(error);
    }
})

const deleteBrand = asyncHandler(async(req,res)=>{
    let brand
    const brand_Id = req.params.id 
    validateMongoDbId(brand_Id)
    try {
        brand = await Brand.findByIdAndDelete(brand_Id)
        res.status(200).json(brand)
        
    } catch (error) {
        console.log(error);
    }
})

const getallBrand = asyncHandler(async(req,res)=>{
    let brand
    try {
        brand = await Brand.find()
        res.status(200).json(brand)
        
    } catch (error) {
        console.log(error);
    }
})

const getsingleBrand = asyncHandler(async(req,res)=>{
    let brand
    const brand_Id = req.params.id 
    validateMongoDbId(brand_Id)
    try {
        brand = await Brand.findById(brand_Id)
        res.status(200).json(brand)
        
    } catch (error) {
        console.log(error);
    }
})






module.exports = {createBrand,updateBrand,deleteBrand,getallBrand,getsingleBrand};