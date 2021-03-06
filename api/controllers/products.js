const baseUrl = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || '3000'

const mongoose = require('mongoose')
const Product = require('../models/product')


exports.products_get_all = (req, res, next) => {

    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            console.log(docs)
            if (docs.length >= 0) {
                res.status(200).json({
                    err: 0,
                    message: "success",
                    response: docs.map(doc => {
                        return {
                            id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            request: {
                                type: 'GET',
                                url: `${baseUrl}:${PORT}/products/` + doc._id
                            }
                        }
                    })
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
}


exports.products_create = (req, res, next) => {
    
    console.log(req.file)

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: `${baseUrl}:${PORT}/` + req.file.path // <- 'uploads/filename.jpg'
    })

    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            err: 0,
            message: "Product created.",
            response: {
                id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: `${baseUrl}:${PORT}/products/` + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            err: 1,
            message: "fails",
            response: err
        })
    })

    
}


exports.products_get_single = (req, res, next) => {
    const id = req.params.productId

    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    err: 0,
                    message: "success",
                    response: doc,
                    request: {
                        type: 'GET',
                        url: `${baseUrl}:${PORT}/products/`
                    }
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
}


exports.products_update = (req, res, next) => {
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
                response: result,
                request: {
                    type: 'GET',
                    url: `${baseUrl}:${PORT}/products/` + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 1,
                message: "Unable to updated product for id: " + id,
                response: err
            })
        });
}


exports.products_delete = (req, res, next) => {
    const id = req.params.productId

    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                err: 0,
                message: "Deleted product id: " + id,
                response: {},
                request: {
                    type: 'POST',
                    url: `${baseUrl}:${PORT}/products/`,
                    body: { name: 'String', price: 'Number' }
                }
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
}