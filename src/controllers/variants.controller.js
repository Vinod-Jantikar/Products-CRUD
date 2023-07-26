const express = require('express');
const Variant = require('../models/variant.model');
const ApiHelper = require('../utils/api.helper');

const router = express.Router();

router.get("/all-variants", async(req, res) => {
    try {
        const allProducts = await Variant.find();
        return ApiHelper.generateApiResponse(res, req, "All products.", 200, allProducts);
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
    }
})


router.patch("/:id", async(req, res) => {
    try {
        console.log(req.body)
        const updatedVariant = await Variant.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return ApiHelper.generateApiResponse(
            res,
            req,
            "Variant updated successfully",
            200,
            updatedVariant
          );
    } catch (error) {
        return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
    }
})


module.exports = router;