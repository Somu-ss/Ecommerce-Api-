const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const User = require('../models/userModel')
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

const productWishlist = asyncHandler(async(req,res)=>{
    let user
    let product
    const userId = req.user.id
    const proId = req.body.id
    console.log(userId);
    console.log(proId);
    try {
        user = await User.findById(userId)
        console.log(user);
        //check the product if it already in wishlist
        const alreadyexist = user.wishlist.find((id)=> id.toString() === proId)

        console.log(alreadyexist);
        if(alreadyexist){
            product = await User.findByIdAndUpdate(userId,{
                $pull:{wishlist: proId}
            },{new:true})
            res.status(200).json(product)

        }else{
            product = await User.findByIdAndUpdate(userId,{
                $push:{wishlist: proId}
            },{new:true})
            res.status(200).json(product)
        }
        
    } catch (error) {
        console.log(error);
    }

})

const ratingProduct = asyncHandler(async(req,res)=>{
    let product
    let rateProduct
    let updateProduct
    const userId = req.user.id
    const {star,proId} = req.body
    try {
        product = await Product.findById(proId)
        const alreadyRated = product.ratings.find((id)=> id.postedby.toString() === userId.toString())

        if(alreadyRated){
            updateProduct = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated}
            },{
                $set:{ "ratings.$.star": star}

            },{new:true})
            res.json(updateProduct)

        }else{
            rateProduct = await Product.findByIdAndUpdate(proId, {
                $push: {
                    ratings: {
                        star: star,
                        postedby: userId
                    }}
            },{new:true})

            res.json(rateProduct)
        }

    } catch (error) {
        return console.log(error)
    }

})

module.exports = {createProduct, getSingleProduct, getAllProduct, updateProduct, deleteProduct,productWishlist, ratingProduct}