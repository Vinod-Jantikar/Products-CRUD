const express = require('express');
const Variant = require('../models/variant.model');
const ApiHelper = require('../utils/api.helper');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const variant = await Variant.create(req.body);
        return ApiHelper.generateApiResponse(res, req, 'Product Created Successfully', 201, variant);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, 'Something went wrong while creating a variant', 500);
    }
})

router.get("/all-variants", async(req, res) => {
    try {
        const allProducts = await Product.find();
        return ApiHelper.generateApiResponse(res, req, "All products.", 200, allProducts);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
    }
})


module.exports = router;