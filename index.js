const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
const Product = require("./models/product");
const methodOverride = require("method-override");
const Farm = require("./models/farm");
const session = require("express-session");
const flash = require("connect-flash");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.message = req.flash("success");
  next();
});

// Farm Routes
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({}).populate("products", "name");
  res.render("farms/index", { farms, message: req.flash("success") });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const farm = await Farm.findById(id).populate("products");
    res.render("farms/details", { farm });
  } catch (e) {
    console.log(e);
  }
});

app.post("/farms", async (req, res) => {
  const { name, location, email } = req.body;
  const request = { name, location, email };
  const newFarm = new Farm(request);
  await newFarm.save();

  req.flash("success", "Farm added successfully");

  res.redirect(`/farms/${newFarm._id}`);
});

app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;

  const farm = await Farm.findById(id);
  if (farm) {
    res.render("products/new", { categories, farm_id: id });
  }
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const request = { name, price, category };
  const farm = await Farm.findById(id).populate("products");
  if (farm) {
    request.farm = farm;
  }
  const product = new Product(request);
  const newProduct = await product.save();
  farm.products.push(newProduct);
  await farm.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.delete("/farms/:id", async (req, res) => {
  const { id } = req.params;
  await Farm.findByIdAndDelete(id)
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
  res.redirect("/farms");
});

// Product Routes

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
    const product = await Product.findById(id).populate("farm", "name");
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
