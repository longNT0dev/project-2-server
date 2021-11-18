const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const faker = require("faker");
const Product = require("./product.model.js");
const verifyToken = require("../../middlewares/verifyToken.js")



router.get("/", (req, res, next) => {
  let page = req.query.page;
  let limit = Number(req.query.limit);

  Product.find()
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