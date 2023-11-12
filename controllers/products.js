const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    const { company, name, featured, sort } = req.query;
    const queryObject = {};

    if (featured){
        queryObject.featured = featured;
    }
    if (company) {
        queryObject.company = company;
    }
    if(name){
        queryObject.name = {$regex: name, $options: "i"};
    }
    
    let apiData = Product.find(queryObject);
    if(sort){
        const sortList = sort.split(",").join(" ");
        apiData = apiData.sort(sortList);
    }

    try {
        const myData = await apiData.sort(sort);
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
