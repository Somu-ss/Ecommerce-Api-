const express = require('express');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlware')
const { createBlog, updateBlog, getAllblogs, getSingleblog, deleteBlog, likeBlog, dislikeBlog, uploadImage } = require('../controller/blogController');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages');


const router = express.Router()

//Create Blog
router.post('/create',authMiddleware,isAdmin,createBlog)

//upload images
router.put('/upload/:id', authMiddleware,isAdmin, uploadPhoto.array('images', 4), blogImgResize, uploadImage)

//Like Blog
router.put('/likes',authMiddleware, likeBlog)

//Dislike Blog
router.put('/dislikes',authMiddleware, dislikeBlog)

//Update Blog
router.put('/update/:id',authMiddleware,isAdmin, updateBlog)

//Get All blogs
router.get('/get-all', getAllblogs)

//Get Single Blog
router.get('/get-blog/:id', getSingleblog)

//Delete BLog
router.delete('/delete/:id',authMiddleware,isAdmin, deleteBlog)


module.exports = router;