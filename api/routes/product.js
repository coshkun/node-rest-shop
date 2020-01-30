const express = require('express')
const router = express.Router()

//MARK: - List Products
router.get('/', (req, res, next) => {
    res.status(200).json({
        err: 0,
        message: "No products awailible yet."
    })
})

//MARK: - Create Single
router.post('/', (req, res, next) => {
    res.status(201).json({
        err: 0,
        message: "No products created yet."
    })
})

//MARK: - Get Detail By ID
router.get('/:productId',(req, res, next) => {
    const id = req.params.productId
    if (id === 'special') {
        res.status(200).json({
            err: 0,
            message: "You have reached the special product details.",
            id: id
        })
    } else {
        res.status(200).json({
            err: 0,
            message: "You have passed an id: " + id
        })
    }
})

//MARK: - Update Single By ID
router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        err: 0,
        message: "Updated product id: " + id
    })
})

//MARK: - Delete Single By ID
router.delete('/:productId',(req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        err: 0,
        message: "Deleted product id: " + id
    })
})

module.exports = router