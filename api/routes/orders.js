const express = require('express')
const router = express.Router()
const baseUrl = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || '3000'

const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

//MARK: - List Products
router.get('/', (req, res, next) => {

    Order.find()
    .select('_id product quantity')
    .populate('product', '_id name price')
    .exec()
    .then(docs => {
        console.log(docs)
        res.status(200).json({
            err: 0,
            message: "success",
            count: docs.length,
            response: docs.map(doc => {
                if (doc.product) { //product populated
                    return {
                        id: doc._id,
                        quantity: doc.quantity,
                        product: {
                            id: doc.product._id,
                            name: doc.product.name,
                            price: doc.product.price
                        },
                        request: {
                            type: 'GET',
                            url: `${baseUrl}:${PORT}/orders/${doc._id}`
                        }
                    }
                } else {
                    return { //product is null
                        id: doc._id,
                        quantity: doc.quantity,
                        product: {},
                        request: {
                            type: 'GET',
                            url: `${baseUrl}:${PORT}/orders/${doc._id}`
                        }
                    }
                }
                
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "Unable to find orders.",
            response: err
        })
    });
})

//MARK: - Create Single
router.post('/', (req, res, next) => {
    // Check if we have the product in DB
    Product.findById(req.body.productId)
    .then(product => {
        if(!product) {
            return res.status(404).json({
                err: 1,
                message: "Product not foud, can not create order.",
                request: req.body,
                response: {}
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
    
        return order.save()
    })
    .then(result => {
        console.log(result)
        res.status(201).json({
            err: 0,
            message: "Order created.",
            response: {
                id: result._id,
                productId: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: `${baseUrl}:${PORT}/orders/${result._id}`
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "Can not create order.",
            request: req.body,
            response: err
        })
    });
})

//MARK: - Get Detail By ID
router.get('/:orderId',(req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product', '_id name price')
    .exec()
    .then(order => {
        console.log(order)
        if (!order) {
            return res.status(404).json({
                err: 1,
                message: "Order not found"
            })
        }

        res.status(200).json({
            err: 0,
            message: "success",
            response: order,
            request: {
                type: 'GET',
                url: `${baseUrl}:${PORT}/orders`
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "fails",
            response: err
        })
    });
})

//MARK: - Update Single By ID
router.patch('/:orderId',(req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        err: 0,
        message: "Updated order id: " + id
    })
})

//MARK: - Delete Single By ID
router.delete('/:orderId',(req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            err: 0,
            message: "Order deleted.",
            request: {
                type: 'POST',
                url: `${baseUrl}:${PORT}/orders`,
                body: { productId: 'STRING', quantity: 'INT' }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "fails",
            response: err
        })
    });
})

module.exports = router