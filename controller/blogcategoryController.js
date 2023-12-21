const blogCategory = require('../models/blogcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbID');

const createBCategory = asyncHandler(async(req,res)=>{
    let category
    let findCategory
    const categoryName = req.body
    try {
         //find category if it already exist
        findCategory = await blogCategory.findOne(category?.title)
        //if already exist then send Dublicate entry
        if(findCategory?.title === categoryName?.title){ 
            res.json('Category Already Exists, Dublicate Entry')
        }
        else{
            blog = await blogCategory.create(categoryName)
            res.json(blog)
        }
              
    } catch (error) {
        console.log(error);
    }
})

const updateBCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    const categoryName = req.body.title
    validateMongoDbId(category_Id)
    try {
        category = await blogCategory.findByIdAndUpdate(category_Id, {
            title: categoryName
        },{new:true})
        res.status(201).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const deleteBCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    validateMongoDbId(category_Id)
    try {
        category = await blogCategory.findByIdAndDelete(category_Id)
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const getallBCategory = asyncHandler(async(req,res)=>{
    let category
    try {
        category = await blogCategory.find()
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})

const getsingleBCategory = asyncHandler(async(req,res)=>{
    let category
    const category_Id = req.params.id 
    validateMongoDbId(category_Id)
    try {
        category = await blogCategory.findById(category_Id)
        res.status(200).json(category)
        
    } catch (error) {
        console.log(error);
    }
})






module.exports = {createBCategory,updateBCategory,deleteBCategory,getallBCategory,getsingleBCategory};