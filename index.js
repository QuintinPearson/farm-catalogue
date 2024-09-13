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
app.use(express.urlencoded({ extended: true }));

const categories = ["dairy", "vegetable", "fruit", "other"];

// Get all Products
app.get("/products", async (req, res) => {
  const { category } = req.query || "";
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
    console.log(category);
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category });
    console.log(category);
  }
});

// Get the New Product form
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

// Get the Edit Product form
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

// Create a new Product
app.post("/products", async (req, res) => {
  const { name, price, category } = req.body;
  const request = { name, price, category };
  const newProduct = new Product(request);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const request = { name, price, category };
  const updatedProduct = await Product.findByIdAndUpdate(id, request, {
    runValidators: true,
    new: true,
  }).then((data) => console.log(data));
  res.redirect(`/products/${id}`);
});

// Get a single Product
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.render("products/details", { product });
  } catch (e) {
    console.log(e);
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.deleteOne({ _id: id }).then((e) => console.log(e));
  const products = await Product.find({});
  res.redirect("/products");
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
