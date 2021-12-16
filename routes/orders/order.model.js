const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  productId: {
    // Gọi lên product lấy thông tin về sản phẩm và update số lượng
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
