const express = require('express')
const router = express.Router()
// const baseUrl = process.env.BASE_URL || 'http://localhost'
// const PORT = process.env.PORT || '3000'

//const mongoose = require('mongoose')
//const Order = require('../models/order')
//const Product = require('../models/product')

const checkAuth = require('../middlewares/check-auth')
const OrderController = require('../controllers/orders')

//MARK: - List Products
router.get('/', checkAuth, OrderController.orders_get_all)

//MARK: - Create Single
router.post('/', checkAuth, OrderController.orders_post)

//MARK: - Get Detail By ID
router.get('/:orderId', checkAuth, OrderController.orders_get_single)

//MARK: - Update Single By ID
router.patch('/:orderId', checkAuth, OrderController.orders_update)

//MARK: - Delete Single By ID
router.delete('/:orderId', checkAuth, OrderController.orders_delete)

module.exports = router