const express = require('express')
const router = express.Router()
// const baseUrl = process.env.BASE_URL || 'http://localhost'
// const PORT = process.env.PORT || '3000'
// const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'mysupersecretveryhiddenkeygoeshere'

// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const checkAuth = require('../middlewares/check-auth')
const Controller = require('../controllers/users')

//const User = require('../models/user')



router.post('/signup', Controller.users_signup)

router.post('/login', Controller.users_login)

router.delete('/:userId', checkAuth, Controller.users_delete)


module.exports = router