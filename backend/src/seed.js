const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const Product = require("./models/Product");

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany([
      { name: "Tomato", category: "Vegetable", price: 30, unit: "kg" },
      { name: "Potato", category: "Vegetable", price: 25, unit: "kg" },
      { name: "Onion", category: "Vegetable", price: 20, unit: "kg" },
      { name: "Apple", category: "Fruit", price: 120, unit: "kg" },
      { name: "Banana", category: "Fruit", price: 50, unit: "kg" },
      { name: "Guave", category: "Fruit", price: 60, unit:"kg"},
      { name: "Ladyfinger", category: "Vegetable", price:80, unit:"kg"},
    ]);

    console.log("Products seeded!");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();