const express = require('express')
const {isAdmin, authMiddleware} = require('../middlewares/authMiddlware')
const { createProduct, getSingleProduct, getAllProduct, updateProduct, deleteProduct, productWishlist, ratingProduct, uploadImage } = require('../controller/productController')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')

const router = express.Router()

//Create Products
router.post('/create', authMiddleware,isAdmin,createProduct)

//Upload Photos
router.put('/upload/:id', authMiddleware,isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImage)

//Get Single Product Using ID
router.get('/:id', getSingleProduct)

//Get All Products
router.get('/', getAllProduct)

//Add WishList
router.put('/wishlist',authMiddleware, productWishlist)

//Rating 
router.put('/ratings',authMiddleware, ratingProduct)

//Update a Product
router.put('/update/:id',authMiddleware,isAdmin, updateProduct)

//delete a Product
router.delete('/delete/:id',authMiddleware,isAdmin, deleteProduct)


module.exports = router