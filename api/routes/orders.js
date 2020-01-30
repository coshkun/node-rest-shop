const express = require('express')
const router = express.Router()

//MARK: - List Products
router.get('/', (req, res, next) => {
    res.status(200).json({
        err: 0,
        message: "No orders awailible yet."
    })
})

//MARK: - Create Single
router.post('/', (req, res, next) => {
    res.status(201).json({
        err: 0,
        message: "No order created yet."
    })
})

//MARK: - Get Detail By ID
router.get('/:orderId',(req, res, next) => {
    const id = req.params.orderId
    if (id === 'special') {
        res.status(200).json({
            err: 0,
            message: "You have reached the special order's details.",
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
router.patch('/:orderId',(req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        err: 0,
        message: "Updated order id: " + id
    })
})

//MARK: - Delete Single By ID
router.delete('/:orderId',(req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        err: 0,
        message: "Deleted order id: " + id
    })
})

module.exports = router