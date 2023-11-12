const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    try {
        const myData = await Product.find({});
        res.status(200).json({ success: true, data: myData });
    } catch (error) {
        console.error("Error fetching all products:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const getAllProductsTesting = async (req, res) => {
    try {
        const myData = await Product.find(req.query);
        console.log(
            "~file: product.js ~ getAllProductsTesting ~ req.query",
            req.query
        );
        res.status(200).json({ success: true, data: myData });
    } catch (error) {
        console.error("Error fetching products with query:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { getAllProducts, getAllProductsTesting };
