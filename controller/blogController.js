const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbID');

const createBlog = asyncHandler(async(req,res)=>{
    let blog
    const createblog = req.body;
    try {
        blog = await Blog.create(createblog)
    } catch (error) {
        console.log(error);
    }
    res.status(203).json(blog)
})

const updateBlog = asyncHandler(async(req,res)=>{
    let blog
    const updateblog = req.params.id;
    const update = req.body
    try {
        blog = await Blog.findByIdAndUpdate(updateblog, update,{new:true})
    } catch (error) {
        console.log(error);
    }
    res.status(203).json(blog)
})

const getAllblogs = asyncHandler(async(req,res)=>{
    let blog
    try {
        blog = await Blog.find()
    } catch (error) {
        console.log(error)
    }
    res.status(200).json(blog)
})

const getSingleblog = asyncHandler(async(req,res)=>{
    let blog
    let updateViews
    const blog_id = req.params.id;
    try {
        blog = await Blog.findById(blog_id)
                .populate("likes").populate("dislikes")
        updateViews = await Blog.findByIdAndUpdate(blog_id,{
            $inc: {numViews:1}
        },{
            new:true
        })
    } catch (error) {
        console.log(error);
    } 
    res.status(200).json(blog)

})

const deleteBlog = asyncHandler(async(req,res)=>{
    let blog
    const blog_id = req.params.id
    try {
        blog = await Blog.findByIdAndDelete(blog_id)
    } catch (error) {
        console.log(error);
    }
    res.status(201).json(blog)
})

const likeBlog = asyncHandler(async(req,res)=>{
    let blog
    let loginUserId
    const blog_id = req.body.blogId;
    validateMongoDbId(blog_id)
    try {
        let isLiked
        let isDisliked
        blog = await Blog.findById(blog_id)
        loginUserId = req?.user?.id
        console.log(loginUserId);
        //Find the user if liked (Boolean)
        isLiked = blog?.isLiked
        //Find the User if Disliked
       isDisliked = blog?.dislikes?.some((Id)=>
       Id.toString() === loginUserId.toString()
  )

        if(isDisliked){
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $pull: { dislikes: loginUserId},
                isDisliked: false
            },{new:true})
            res.json(blog)
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $pull: { likes: loginUserId},
                isLiked: false
            },{new:true})
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $push: { likes: loginUserId},
                isLiked: true
            },{new:true})
            res.json(blog)
        }
    } catch (error) {
        console.log(error);
        
    }

})


const dislikeBlog = asyncHandler(async(req,res)=>{
    let blog
    let loginUserId
    const blog_id = req.body.blogId;
    validateMongoDbId(blog_id)
    try {
        let isLiked
        let isDisliked
        blog = await Blog.findById(blog_id)
        loginUserId = req?.user?._id
        //Find the user if disliked (Boolean)
        isDisliked = blog?.isDisliked
        //Find the User if likes
       isLiked = blog?.likes?.some((Id)=>
            Id.toString() === loginUserId.toString()
       )
       console.log(isLiked);
       console.log(loginUserId);
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $pull: { likes: loginUserId},
                isLiked: false
            },{new:true})
            res.json(blog)
        }

        if(isDisliked){
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $pull: { dislikes: loginUserId},
                isDisliked: false
            },{new:true})
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blog_id, {
                $push: { dislikes: loginUserId},
                isDisliked: true
            },{new:true})
            res.json(blog)
        }

    } catch (error) {
        console.log(error);
        
    }

})

module.exports = {createBlog,updateBlog,getAllblogs,getSingleblog,deleteBlog, likeBlog, dislikeBlog};