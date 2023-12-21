const productCategory = require('../models/productcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbID');

const createPCategory = asyncHandler(async(req,res)=>{
    let category
    let findCategory
    const categoryName = req.body
    try {
         //find category if it already exist
         findCategory = await blogCategory.findOne(category?.title)
         //if already exist then send Dublicate entry
         if(findCategory?.title === categoryName.title){ 
             res.json('Category Already Exists, Dublicate Entry')
         }
         //Create category if it does'nt exist already
        category = await productCategory.create(categoryName)
        res.status(201).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const updatePCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    const categoryName = req.body.title
    validateMongoDbId(category_Id)
    try {
        category = await productCategory.findByIdAndUpdate(category_Id, {
            title: categoryName
        },{new:true})
        res.status(201).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const deletePCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    validateMongoDbId(category_Id)
    try {
        category = await productCategory.findByIdAndDelete(category_Id)
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const getallPCategory = asyncHandler(async(req,res)=>{
    let category
    try {
        category = await productCategory.find()
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const getsinglePCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    validateMongoDbId(category_Id)
    try {
        category = await productCategory.findById(category_Id)
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})






module.exports = {createPCategory,updatePCategory,deletePCategory,getallPCategory,getsinglePCategory};