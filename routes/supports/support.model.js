const mongoose = require('mongoose')


const SupportSchema = mongoose.Schema({
    productId : {
        type:String,
        required:true
    },
    sendId : {
        type:String,
        required:true
    },
    receiveId: {
        type:String,
        required: true
    },
    reason: {
        type:String,
        required: true
    },
    dateAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type:Number,
        default: 0 
    }
})

module.exports = mongoose.model('Support',SupportSchema)