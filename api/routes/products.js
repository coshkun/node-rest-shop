const express = require('express')
const router = express.Router()
// const baseUrl = process.env.BASE_URL || 'http://localhost'
// const PORT = process.env.PORT || '3000'

// const mongoose = require('mongoose')
// const Product = require('../models/product')

const checkAuth = require('../middlewares/check-auth')
const ProductController = require('../controllers/products')


// multipart-form-data body parser module
const multer = require('multer'); 
//const upload = multer({dest: 'uploads/'})
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = function(req, file, cb) {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true) //accept
    } else {
        cb(new Error('Unsupported file format with: ' +  file.mimetype), false) //reject
    }
}
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 //means 5 megs
    },
    fileFilter: fileFilter
})


//MARK: - List Products
router.get('/', ProductController.products_get_all)

//MARK: - Create Single
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create)

//MARK: - Get Detail By ID
router.get('/:productId', ProductController.products_get_single)

//MARK: - Update Single By ID
router.patch('/:productId', checkAuth, ProductController.products_update)

//MARK: - Delete Single By ID
router.delete('/:productId', checkAuth, ProductController.products_delete)

module.exports = router