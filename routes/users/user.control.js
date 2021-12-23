const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model.js");
const Product = require("../products/product.model.js");
const upload = require("../../ultis/multer");
const Support = require("../supports/support.model.js");
const e = require("cors");

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
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/post-product", upload.single("image"), async (req, res, next) => {
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
    return res.status(403).json({ err });
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
        console.log(err);
      }
    } else {
      return res.redirect("/login");
    }
  });
});

router.get("/info", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403);
  }

  jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
    if (decoded._id) {
      try {
        let info = await User.findById(decoded._id);
        let { name, address, phoneNumber } = info;
        res.json({ name, address, phoneNumber });
      } catch (err) {
        res.json(err);
      }
    } else {
      return res.redirect("/login");
    }
  });
});

router.patch("/update-info", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403);
  }

  jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
    if (decoded._id) {
      let name = req.query.name;
      let address = req.query.address;
      let phoneNumber = req.query.phoneNumber;
      console.log(decoded._id);
      try {
        await User.updateOne(
          { _id: decoded._id },
          {
            $set: {
              name: name,
              address: address,
              phoneNumber: phoneNumber,
            },
          }
        );
      } catch (err) {
        res.json(err);
      }
    } else {
      return res.redirect("/login");
    }
  });
});

router.post("/review", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) return res.json(err);
      if (decoded._id) {
        Product.updateOne(
          { _id: req.query.id },
          {
            $push: {
              comments: {
                rating: parseInt(req.query.rating),
                comment: req.query.comment,
              },
            },
          },
          function (err) {
            if (err) return res.json(err);
            return res.json("ok");
          }
        );
      }
    });
  } catch (err) {
    return res.json(err);
  }
});

router.post("/assistance", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) return res.json(err);
      if (decoded._id) {
        const supportForm = new Support({
          productId: req.query.productId,
          sendId: decoded._id,
          receiveId: req.query.userId,
          reason: req.query.reason,
        });
        await supportForm.save();
        return res.json("ok");
      }
    });
  } catch (err) {
    return res.json(err);
  }
});

router.get("/assistances", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) return res.json(err);
      if (decoded._id) {
        let supportForm = await Support.find({ receiveId: decoded._id });
        let result = [];
        for (let e of supportForm) {
          let info = await Product.find({
            _id: e.productId,
          });
          let { image, description } = info[0];
          let { _id, sendId, receiveId, reason } = e;
          result.push({
            _id,
            sendId,
            receiveId,
            reason,
            image,
            description,
          });
        }
        return res.json(result);
      }
    });
  } catch (err) {
    return res.json(err);
  }
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
