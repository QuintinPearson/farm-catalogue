const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand")
  .then(() => {
    console.log("Connection to Mongo open");
  })
  .catch((e) => console.log(e));

// Insert a single item into the collection
// const p = new Product({
//   name: "Ruby Grapefruit",
//   price: 1.99,
//   category: "fruit",
// });

// p.save()
//   .then((data) => console.log(data))
//   .catch((e) => console.log(e));

// Insert Many items into the DB at once.

const seedProducts = [
  { name: "Ruby Grapefruit", price: 1.99, category: "fruit" },
  { name: "Golden Apple", price: 0.99, category: "fruit" },
  { name: "Broccoli", price: 1.5, category: "vegetable" },
  { name: "Carrot", price: 0.75, category: "vegetable" },
  { name: "Whole Milk", price: 3.25, category: "dairy" },
  { name: "Cheddar Cheese", price: 4.5, category: "dairy" },
  { name: "Free-Range Eggs", price: 2.99, category: "dairy" },
  { name: "Almonds", price: 5.99, category: "fruit" },
  { name: "Organic Honey", price: 7.25, category: "fruit" },
  { name: "Salmon Fillet", price: 12.99, category: "vegetable" },
];

Product.insertMany(seedProducts)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
