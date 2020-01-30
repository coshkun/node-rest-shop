const express = require('express');
const app = express();

const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)


app.use((req, res, next) => {
    res.status(200).json({
        err: 0,
        message: "It works!"
    })
});

module.exports = app;