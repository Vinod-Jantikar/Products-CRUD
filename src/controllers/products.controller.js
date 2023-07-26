const express = require("express");
const Product = require("../models/products.model");
const Variant = require("../models/variant.model");
const ApiHelper = require("../utils/api.helper");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const variant = await Variant.create(req.body.variant);

    const payload = {
      name,
      description,
      price,
      variantIds: [variant._id],
    };

    const product = await Product.create(payload);

    console.log(product);
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Product Created Successfully",
      201,
      product
    );
  } catch (error) {
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Something went wrong while creating a product",
      500
    );
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return ApiHelper.generateApiResponse(res, req, "Product not found", 404);
    }

    const { name, description, price } = req.body;
    let payload = {
      name,
      description,
      price,
    };
    let updatedProduct;

    if (req.body.variant) {
      if (req.body.variantAction === "remove") {
        updatedProduct = await Product.updateOne(
          { _id: req.params.id },
          { $pull: { variantIds: req.body.variant } }
        );
      } else {
        const variant = await Variant.create(req.body.variant);
        updatedProduct = await Product.updateOne(
          { _id: req.params.id },
          { payload, $addToSet: { variantIds: variant._id } },
          { new: true }
        );
      }
    } else {
      updatedProduct = await Product.updateOne(
        { _id: req.params.id },
        { payload },
        { new: true }
      );
    }

    updatedProduct = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Product updated successfully",
      200,
      updatedProduct
    );
  } catch (error) {
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Something went wrong.",
      500
    );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return ApiHelper.generateApiResponse(res, req, "Product not found", 404);
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Product has been successfully deleted.",
      200,
      deletedProduct
    );
  } catch (error) {
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Failed to delete the product.",
      500
    );
  }
});

router.get("/all-products", async (req, res) => {
  try {
    const allProducts = await Product.find().populate({path: "variantIds"});
    return ApiHelper.generateApiResponse(
      res,
      req,
      "All products.",
      200,
      allProducts
    );
  } catch (error) {
    return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
  }
});

router.get("", async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const products = await Product.aggregate([
        {
            $lookup: {
                from: 'variants',
                localField: 'variantIds',
                foreignField: '_id',
                as: 'variantsData'
            }
        },
        {
            $match: {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { 'variantsData.name': { $regex: searchQuery, $options: 'i' } }
                ]
            }
        }
    ]);
    return ApiHelper.generateApiResponse(
      res,
      req,
      "Search results.",
      200,
      products
    );
  } catch (error) {
    return ApiHelper.generateApiResponse(res, req, "Something went wrong", 500);
  }
});

module.exports = router;
