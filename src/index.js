const express = require('express');
const productController = require('./controllers/products.controller');
const variantController = require('./controllers/variants.controller')
const app = express();

app.use(express.json());
app.use('/api/product', productController);
app.use('/api/variant', variantController)

module.exports = app;