const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./user.model.js");

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
    const user = await User.findOne({ phoneNumber: req.query.phoneNumber });
    if(!user) {
      return res.status(404).json("User not found");
    }
   

    const validPassword = await bcrypt.compare(
      req.query.password,
      user.password
    );
    if(!validPassword) {
      return res.status(400).json("Wrong password");
    }

    let token = jwt.sign(
      {
        _id: user._id,
        role:user.role
      },
      process.env.SECRET_KEY,
      {expiresIn: 60*60},
    );
    return res.cookie("access_token",token,{
      httpOnly: true,
      secure: true
    }).status(200).json({message:"ok"})
  } catch (err) {
    res.status(500).json(err);
  }
});

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

module.exports = router;

// Xử lí việc lưu vào đâu
// Kiểm tra password có đúng k
// bcrypt.compare('B4c0/\/', hash, function(err, res) {
//     // res == true
// });

// Cần kiểm tra dữ liệu dùng express-validator
