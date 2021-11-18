const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  // Chọn 1 số sản phẩm nhất định
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }, 
  comments: {
    type:Array
  }
});


module.exports = mongoose.model("Product",ProductSchema)