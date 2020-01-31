const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));

const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)


// app.use((req, res, next) => {
//     res.status(200).json({
//         err: 0,
//         message: "It works!"
//     })
// });

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