const express = require("express");
const router = express.Router();
// const faker = require("faker");
const Product = require("./product.model.js");
const jwt = require("jsonwebtoken");

// router public
router.get("/", (req, res, next) => {
  let page = req.query.page;
  let limit = Number(req.query.limit);

  Product.find({ status: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        if (err) return next(err);
        res.status(200).json({ products, count });
      });
    });
});

router.get("/search", (req, res, next) => {
  let category = req.query.category;

  Product.find({ category: category }).exec((err, products) => {
    if (err) return next(err);

    return res.status(200).json(products);
  });
});

router.get("/detail", (req, res, next) => {
  let id = req.query.id;

  Product.find({ _id: id }).exec((err, product) => {
    if (err) return next(err);

    return res.status(200).json(product);
  });
});

// router private

router.get("/waiting-product", (req, res, next) => {
  // [1] if use config default 
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403);
  }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role === "admin") {
      Product.find({ status: 0 }).exec((err, products) => {
        Product.countDocuments((err, count) => {
          if (err) return next(err);
          res.status(200).json({ products, count });
        });
      });
    } else if (decoded.role === "user") {
      Product.find({ status: 0, user_id: decoded._id }).exec((err, products) => {
        Product.countDocuments((err, count) => {
          if (err) return next(err);
          res.status(200).json({ products, count });
        });
      });
    } else {
      return res.json("Not auth");
    }
  } catch (err) {
    return res.status(403).json({ err });
  }
});

module.exports = router;








// router.get("/generate-fake-data", async (req, res, next) => {
//   for (let i = 0; i < 70; i++) {
//     const newProduct = new Product();
//     newProduct.image = faker.image.image();
//     newProduct.description = faker.commerce.productDescription();
//     newProduct.category = faker.commerce.productMaterial();
//     newProduct.price = faker.commerce.price();
//     newProduct.quantity = parseInt(Math.random() * 2000000) + 150000;

//     await newProduct.save((err) => {
//       if (err) {
//         return next(err);
//       }
//     });
//   }
//   res.json("ok");
// });
