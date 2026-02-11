const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const blacklistedToken = await blacklistTokenModel.findOne({token: token});

    if(blacklistedToken){
        return res.status(401).json({message: "Token is blacklisted - user has logged out"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({message: "Unauthorized access"});
        }
        req.user = user; 
        return next();
    }catch(err){
        return res.status(401).json({message: "Invalid token"});
    }

}