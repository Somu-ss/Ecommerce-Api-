const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const Product = require('../models/productModel')

const createProduct = asyncHandler(async(req,res)=>{
    let product = req.body
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const createProdct = await Product.create(product)
        res.status(201).json(createProdct)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async(req,res)=> {
    const id = req.params.id
    let product
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        product = await Product.findByIdAndUpdate(id, req.body,{ new: true})
        res.status(200).json(product)
    } catch (error) {
        throw new Error(error)
    }
})


const getSingleProduct = asyncHandler(async(req,res)=> {
    let product = req.params.id;
    let getProduct
    try {
        getProduct = await Product.findById(product);
        res.status(200).json(getProduct)
        
    } catch (error) {
        throw new Error(error)
    }
})

//Get All Products
const getAllProduct = asyncHandler(async(req,res)=>{
    let query;
    let getAll
    try {
        //Filtering the Products
        const queryObjec = { ...req.query };
        const excludeFields = ["page","sort","limit","fields"];
        excludeFields.forEach((el) => delete queryObjec[el])

        let queryStr = JSON.stringify(queryObjec)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$'+match);

        console.log(queryStr);

        query = Product.find(JSON.parse(queryStr))

        //Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy)

        }else{
            query = query.sort("-createdAt")
        }

        //Limiting the Fields
        if(req.query.fields){
            const selectField = req.query.fields.split(",").join(" ");
            query = query.select(selectField)
        }else{
            query = query.select("-__v")

        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1)*limit
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) { res.json({message: "There is No Product Available"})}
        }


        getAll = await query
        res.status(200).json(getAll)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async(req,res)=> {
    const id = req.params.id
    let product
    try {
        product = await Product.findByIdAndDelete(id)
        res.status(200).json({Message: "This Product Deleted Succesfully"})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createProduct, getSingleProduct, getAllProduct, updateProduct, deleteProduct}