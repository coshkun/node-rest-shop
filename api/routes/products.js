const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Product = require('../models/product')

//MARK: - List Products
router.get('/', (req, res, next) => {

    Product.find()
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc.length >= 0) {
                res.status(200).json({
                    err: 0,
                    message: "success",
                    response: doc
                })
            } else {
                // no obj in DB
                res.status(200).json({  //404
                    err: 0,
                    message: "Nothing found in products.",
                    response: []
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 1,
                message: "No products awailible yet.",
                response: err
            })
        });
})

//MARK: - Create Single
router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            err: 0,
            message: "Product created.",
            request: req.body,
            response: product
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "fails",
            request: req.body,
            response: err
        })
    })

    
})

//MARK: - Get Detail By ID
router.get('/:productId',(req, res, next) => {
    const id = req.params.productId

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    err: 0,
                    message: "success",
                    response: doc
                })
            } else {
                res.status(404).json({
                    err: 1,
                    message: "Not valid entry found for provided ID",
                    response: {}
                })
            }
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
router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId
    // Product.update({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice } })

    //Make them optional
    const upOptions = {}
    for (const ops of req.body) {
        if (ops.propName === 'productId') { continue }
        upOptions[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: upOptions })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                err: 0,
                message: "Updated product by id: " + id,
                request: req.body,
                response: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 1,
                message: "Unable to updated product for id: " + id,
                request: req.body,
                response: err
            })
        });
})

//MARK: - Delete Single By ID
router.delete('/:productId',(req, res, next) => {
    const id = req.params.productId

    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                err: 0,
                message: "Deleted product id: " + id,
                response: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 1,
                message: "Unable to delete product with id: " + id,
                response: err
            })
        });
})

module.exports = router