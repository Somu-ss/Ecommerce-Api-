const express = require('express');
const { createBCategory, getallBCategory, getsingleBCategory, updateBCategory, deleteBCategory } = require('../controller/blogcategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlware');

const router = express.Router()

//Create Product Category
router.post('/create',authMiddleware,isAdmin,createBCategory)

//Get All Category
router.get('/get-all', getallBCategory)

//Get a Single category
router.get('/:id', getsingleBCategory) 

//update the Category
router.put('/update/:id',authMiddleware,isAdmin, updateBCategory)

//delete the category
router.delete('/delete/:id',authMiddleware,isAdmin,deleteBCategory)

module.exports = router