const express = require("express");
const router = express.Router();
const Order = require("./order.model.js");
const jwt = require("jsonwebtoken");
const Product = require("../products/product.model.js");

router.post("/order", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) return res.json(err);
      if (decoded._id) {
        const newOrder = new Order({
          userId: decoded._id,
          price: req.query.price,
          image: req.query.image,
          description: req.query.description,
          address: req.query.address,
          productId: req.query.id,
          quantity: req.query.quantity,
        });
        await newOrder.save(function (err) {
          if (err) return res.json(err);
          Product.updateOne(
            { _id: req.query.id },
            {
              $inc: {
                quantity: -Number(req.query.quantity),
              },
            },
            function (err) {
              if (err) return res.json(err);
              return res.json("ok");
            }
          );
        });
      } else {
        return res.redirect("/login");
      }
    });
  } catch (err) {
    return res.status(403).json({ err });
  }
});

router.get("/orders", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded._id) {
        Order.find({ userId: decoded._id }, function (err, orders) {
          if (err) return res.json(err);
          return res.json(orders);
        });
      } else {
        return res.redirect("/login");
      }
    });
  } catch (err) {
    return res.status(403).json({ err });
  }
});

router.post("/cancel-order", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded._id) {
        Order.updateOne(
          {
            _id: req.query.id,
          },
          {
            $set: {
              status: -1,
            },
          }
        )
          .then(() => {
            return res.json("ok");
          })
          .catch((err) => {
            return res.json(err);
          });
      } else {
        return res.redirect("/login");
      }
    });
  } catch (err) {
    return res.status(403).json({ err });
  }
});

router.post("/cancel-undo", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded._id) {
        Order.updateOne(
          {
            _id: req.query.id,
          },
          {
            $set: {
              status: 0,
            },
          }
        )
          .then(() => {
            return res.json("ok");
          })
          .catch((err) => {
            return res.json(err);
          });
      } else {
        return res.redirect("/login");
      }
    });
  } catch (err) {
    return res.status(403).json({ err });
  }
});

module.exports = router;
