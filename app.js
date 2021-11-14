const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const cors = require('cors');

//log request
const logger = require('morgan');
require("dotenv").config()
// database
const mongoose = require("mongoose")
const db = mongoose.connection
const cookieParser = require('cookie-parser')


// connect to db
mongoose.connect(process.env.MONGODB,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true},()=> {
    console.log("MongoDB connection success")
})
// error handle 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  


//middleware
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(cookieParser())
app.use(logger('dev'));
// parse request to body parse
app.use(express.urlencoded({ extended: true }));
// request to json
app.use(express.json());

// routing
const users = require("./routes/users/user.control.js")
const products = require("./routes/products/product.control.js")
app.use("/users",users)
app.use("/product",products)

app.use("/",(req,res) => {
    res.status(200).json("ok")
})

const PORT = process.env.PORT || 5000

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app)
//   .listen(PORT, function () {
//     console.log('Welcome')
//   })

app.listen(PORT,()=> {
    console.log(`Listening in ${PORT}`)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
});


