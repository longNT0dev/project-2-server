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
  status:{
    type:Number,
    default: 0
  },
  comments: {
    type: Array
  },
  user_id: {
    type:String,
    required: true,
  }
});


module.exports = mongoose.model("Product", ProductSchema)