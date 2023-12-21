const express = require('express');
const { createPCategory, getallPCategory, getsinglePCategory, updatePCategory, deletePCategory } = require('../controller/productcategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlware');

const router = express.Router()

//Create Product Category
router.post('/create',authMiddleware,isAdmin,createPCategory)

//Get All Category
router.get('/get-all', getallPCategory)

//Get a Single category
router.get('/:id', getsinglePCategory) 

//update the Category
router.put('/update/:id',authMiddleware,isAdmin, updatePCategory)

//delete the category
router.delete('/delete/:id',authMiddleware,isAdmin,deletePCategory)

module.exports = router