const express = require('express')
const {isAdmin, authMiddleware} = require('../middlewares/authMiddlware')
const { createProduct, getSingleProduct, getAllProduct, updateProduct, deleteProduct, productWishlist } = require('../controller/productController')

const router = express.Router()

//Create Products
router.post('/create', authMiddleware,isAdmin,createProduct)

//Get Single Product Using ID
router.get('/:id', getSingleProduct)

//Get All Products
router.get('/', getAllProduct)

//Add WishList
router.put('/wishlist',authMiddleware, productWishlist)

//Update a Product
router.put('/update/:id',authMiddleware,isAdmin, updateProduct)

//delete a Product
router.delete('/delete/:id',authMiddleware,isAdmin, deleteProduct)


module.exports = router