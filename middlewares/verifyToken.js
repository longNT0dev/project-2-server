const verifyToken = (req,res,next) =>  {
    let token = req.cookies.access_token
    if(!token){
        return res.status(403)
    }
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded)
    }catch(err){
        return res.status(403).json({err})
    }
    
    console.log(decoded);
}

module.exports = verifyToken