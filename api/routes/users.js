const express = require('express')
const router = express.Router()
const baseUrl = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || '3000'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')



router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email }).exec()
    .then(user => {
        if (user.length > 0) {
            return res.status(409).json({
                err: 1,
                message: "User already exist whit this email."
            })
        } else {
            // here we sure user not registered yet
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        err: 1,
                        message: "Password encryption error."
                    })
                } else {
                    //we have a valid hash here
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })

                    user.save()
                    .then(doc => {
                        console.log(doc)
                        res.status(201).json({
                            err: 0,
                            message: "User created."
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            err: 1,
                            message: "Fails! User not created.",
                            response: err
                        })
                    })
                }
            })
        }
    })

    
    
})


router.post('/signin', (req, res, next) => {
    
})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.param.userId }).exec()
    .then(doc => {
        res.status(200).json({
            err: 0,
            message: "User deleted."
        })
    })
    .catch(err => {
        res.status(500).json({
            err: 1,
            message: "Fails! User not deleted.",
            response: err
        })
    })
})


module.exports = router