const baseUrl = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || '3000'
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'mysupersecretveryhiddenkeygoeshere'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')




exports.users_signup = (req, res, next) => {

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

}



exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(users => {
        if (users.length < 1) {
            // there is no user found in response array
            // the '404 No User' may open the API to the brute-force attacks
            // so we should simply return failed authorization
            return res.status(401).json({
                err: 1,
                message: "Authentication failed."
            })
        }

        //Now we have the user, lets check the password
        bcrypt.compare(req.body.password, users[0].password, (err, isSame) => {
            if (err) {
                // if comparison fails,
                return res.status(401).json({
                    err: 1,
                    message: "Authentication failed."
                })
            }

            if (isSame) {
                // success, with the correct password
                const token = jwt.sign(
                {
                    //PAYLOAD
                    email: users[0].email,
                    sub: users[0]._id
                }, 
                PRIVATE_KEY, 
                {
                    // OPTIONS
                    expiresIn: 1800  //seconds, or '1h' or '7d'
                })

                return res.status(200).json({
                    err: 0,
                    message: "Authentication succesful.",
                    token: token
                })
            }
            // wrong password entered
            return res.status(401).json({
                err: 1,
                message: "Authentication failed."
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            err: 1,
            message: "Fails! Unknown error.",
            response: err
        })
    })
}



exports.users_delete = (req, res, next) => {
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
}