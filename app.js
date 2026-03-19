require("dotenv").config();
const { request } = require("express");
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 3000;

const products_routes = require("./routes/products");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// middleware or to set router
app.use("/api/products", products_routes);

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`${PORT} Yes I'm Connected`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
