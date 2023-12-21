const express = require('express');
const { createBrand, getallBrand, getsingleBrand, updateBrand, deleteBrand } = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlware');

const router = express.Router()

//Create Product Category
router.post('/create',authMiddleware,isAdmin,createBrand)

//Get All Category
router.get('/get-all', getallBrand)

//Get a Single category
router.get('/:id', getsingleBrand) 

//update the Category
router.put('/update/:id',authMiddleware,isAdmin, updateBrand)

//delete the category
router.delete('/delete/:id',authMiddleware,isAdmin,deleteBrand)

module.exports = router