const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getAllProductsTesting,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/products");

// GET routes
router.get("/", getAllProducts);
router.get("/testing", getAllProductsTesting);
router.get("/:id", getProduct);

// POST route
router.post("/", createProduct);

// PUT route
router.put("/:id", updateProduct);

// DELETE route
router.delete("/:id", deleteProduct);

module.exports = router;
