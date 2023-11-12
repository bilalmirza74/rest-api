const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        console.log("connect db");
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        console.log(error);
    }
};

module.exports = connectDB;
