const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    const { company, name, featured, sort, select } = req.query;
    const queryObject = {};

    if (featured !== undefined && featured !== '') {
        queryObject.featured = featured === 'true';
    }
    if (company && company.trim() !== '') {
        queryObject.company = company;
    }
    if(name && name.trim() !== ''){
        queryObject.name = {$regex: name, $options: 'i'};
    }

    let apiData = Product.find(queryObject);
    if(sort){
        const sortList = sort.split(",").join(" ");
        apiData = apiData.sort(sortList);
    }
    if(select){
        const selectList = select.split(",").join(" ");
        apiData = apiData.select(selectList);
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    apiData = apiData.skip(skip).limit(limit);

    try {
        const myData = await apiData;
        res.status(200).json({ success: true, data: myData });
    } catch (error) {
        console.error("Error fetching all products:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const getAllProductsTesting = async (req, res) => {
    try {
        const myData = await Product.find(req.query).sort("name");
        console.log(
            "~file: product.js ~ getAllProductsTesting ~ req.query",
            req.query
        );
        res.status(200).json({ success: true, data: myData, nbHits: myData.length });
    } catch (error) {
        console.error("Error fetching products with query:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = {
    getAllProducts,
    getAllProductsTesting,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
