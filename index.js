const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
const Product = require("./models/product");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(methodOverride("_method"));

// Get all Products
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

// Get a single Product
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/details", { product });
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.deleteOne({ _id: id }).then((e) => console.log(e));
  const products = await Product.find({});
  res.render("products", { products });
});

mongoose
  .connect("mongodb://localhost:27017/farmStand")
  .then(() => {
    console.log("Connection to Mongo open");
  })
  .catch((e) => console.log(e));

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
