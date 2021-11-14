const express = require("express");
const router = express.Router();


//   router.post("/send", (req, res) => {
//     app.io.sockets.emit("socket.io sucessfully passed from app to router");
//   });
// const Message = require("./chat.model.js")

// router.get("/:id",(req, res) => {

// })

// router.post("/signup",(req, res, next)=> {
//     const newUser = new User(req.params)
//     newUser.save()
//     .then(() => res.json({message:"Success"}))
//     .catch(err => next(err));
// })

// router.post("/signin",(req,res,next) => {
//     userService.authenticate(req.body)
//     .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
//     .catch(err => next(err));
// })

// router.get("/",(req, res, next)=> {
//     userService.getAll()
//     .then(users => res.json(users))
//     .catch(err => next(err));
// })
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

// // Xử lí việc lưu vào đâu
