const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model.js");
const Product = require("../products/product.model.js");
const upload = require("../../ultis/multer");
let ObjectID = require("mongodb").ObjectID;

router.post("/register", async (req, res) => {
  try {
    if (req.query.password !== req.query.rePassword) {
      res.json("Incorrect");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.query.password, salt);

    //create new user
    const newUser = new User({
      phoneNumber: req.query.phoneNumber,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNumber: req.query.phoneNumber,
    });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      req.query.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    let token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    return res.status(200).json({
      message: "ok",
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/post-product", upload.single("image"), async (req, res, next) => {
  console.log(req.headers["authorization"]);
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403);
  }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    let { image, description, category, price, quantity } = req.body;
    let product = new Product({
      image: image,
      description: description,
      category: category,
      price: price,
      quantity: quantity,
      user_id: decoded._id,
    });
    await product.save();
    return res.json("ok");
  } catch (err) {
    return res.json(err);
  }
});

router.patch("/check-product", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  // -1 -> decline , 1 -> accept
  if (!token) {
    return res.status(403);
  }

  jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
    if (decoded.role === "admin") {
      try {
        let result = req.query.result;
        let productId = req.query.productId;
        await Product.updateOne(
          { _id: productId },
          {
            $set: {
              status: result,
            },
          }
        );
      } catch (err) {
        console.log(err)
      }
    } else {
      return res.redirect("/login")
    }
  });
});

module.exports = router;

// Xử lí việc lưu vào đâu
// Kiểm tra password có đúng k
// bcrypt.compare('B4c0/\/', hash, function(err, res) {
//     // res == true
// });

// Cần kiểm tra dữ liệu dùng express-validator
// router.get("/:id",(req, res, next)=> {
//     userService.getById(req.params.id)
//     .then(user => user ? res.json(user) : res.sendStatus(404))
//     .catch(err => next(err));
// })
// router.put("/:id",(req, res, next)=> {
//     userService.update(req.params.id, req.body)
//     .then((message) => res.json({message:"success"}))
//     .catch(err => next(err));
// })
// router.delete("/:id",(req, res, next)=> {
//     userService.delete(req.params.id)
//         .then((message) => res.json({message:"success"}))
//         .catch(err => next(err));
// })
// router.get("/home", async(req, res, next) => {
//   try {
//     let token = req.cookies.token
//     let decoded = jwt.verify(token, process.env.SECRET_KEY);
//     console.log(decoded);
//   //   if (decoded.iat < Date.now()) {
//   //     let data = await  User.findOne({
//   //       _id: decoded._id,
//   //     })
//   //     data && res.json({
//   //       username: data.username,
//   //     });
//   //   } else {
//   //     return res.redirect("/")
//   //   }
//   } catch (err) {
//     return res.redirect("/")
//   }
// });
// const cloudinary = require("../../ultis/cloudinary");
// try {
//    Upload image to cloudinary
//   const result = await cloudinary.uploader.upload(req.file.path);
//    Create new user
// let product = new Product({
//     image: result.public_id
// });
//    Save product
//   await product.save();
//   res.json(product);
// } catch (err) {
//   console.log(err);
// }
