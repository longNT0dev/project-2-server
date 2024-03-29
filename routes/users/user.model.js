const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    phoneNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    createdDate:{type: Date,default: Date.now},
    role: {
      type: String,
      default:"user"
    }, 
    name:{
      type:String,
      default:null
    }, 
    address: {
      type:String,
      default:null
    }

})

module.exports = mongoose.model("User",UserSchema) 


// Tự động chuyển thành dạng số nhiều User -> users trong collections