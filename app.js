const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));

//Create Request Parser
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//Disable CORS: Cros-Origin-Resource-Sharing Errors
//by adding missing header fields, this allows 
//single-page-apps to use our API if they are on the same server
app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*') //'*' means allow everything
    req.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method === 'OPTIONS') {
        //checks if a browsers asking us awailble methods,
        //before it send us a POST request.
        req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.status(200).json({}) //ends res for browsers inner call
    }

    next(); // go to next midlleware handler
})

//Create Routers
const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)



//Error Handler for all other incoming requests
app.use((req, res, next) => {
    const error = Error('Not found');
    error.status = 404;
    next(error);
})

//Error Handler for all other thrown errors from application
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        err: 1,
        message: error.message
    })
})

module.exports = app;