const express = require('express');
const Product = require('../models/products.model');
const ApiHelper = require('../utils/api.helper');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return ApiHelper.generateApiResponse(
                res,
                req,
                "All fields are required.",
                400
            );
        }

        const product = await Product.create(req.body);
        return ApiHelper.generateApiResponse(res, req, 'Product Created Successfully', 201, product);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, 'Something went wrong while creating a product', 500);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return ApiHelper.generateApiResponse(res, req, "Inputs can not be empty.", 400);
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return ApiHelper.generateApiResponse(res, req, "Product not found", 404);
        }

        const existingProduct = await Product.findOne({
            $and: [{ name: req.body.name }, { _id: { $ne: req.params.id } }],
        });

        if (existingProduct) {
            return ApiHelper.generateApiResponse(res, req, "The Product with same name already exists.", 409);
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return ApiHelper.generateApiResponse(res, req, "Product updated successfully", 200, updatedProduct);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong.", 500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return ApiHelper.generateApiResponse(res, req, "Product not found", 404);
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        return ApiHelper.generateApiResponse(res, req, "Product has been successfully deleted.", 200, deletedProduct);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Failed to delete the product.", 500);
    }
});

router.get("/all-products", async(req, res) => {
    try {
        const allProducts = await Product.find();
        return ApiHelper.generateApiResponse(res, req, "All products.", 200, allProducts);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
    }
})

router.get('/get', async(req, res) => {
    try {
        const {search} = req.query;

        const products = await Product.find({
            $or: [
              { name: { $regex: search, $options: 'i' } }, 
              { description: { $regex: search, $options: 'i' } },
            ],
          });
          return ApiHelper.generateApiResponse(res, req, "Search results.", 200, products);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
    }
})


module.exports = router;