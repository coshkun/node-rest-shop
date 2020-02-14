const jwt = require('jsonwebtoken')
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'mysupersecretveryhiddenkeygoeshere'

module.exports = (req, res, next) => {

    try {
        //const decoded = jwt.verify(req.body.token, PRIVATE_KEY)
        const decoded = jwt.verify(req.headers.authorization, PRIVATE_KEY)
        //create a new field named as 'userData'
        req.userData = decoded
        //on success, go to next route
        next()
    } catch(err) {
        console.log(err)
        return res.status(401).json({
            err: 1,
            message: "Authentication failed."
        })
    }

    
}