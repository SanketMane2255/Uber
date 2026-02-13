const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

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

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("Token in authCaptain middleware:", token); // Debugging log
    if(!token){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    console.log("Is token blacklisted?", isBlacklisted); // Debugging log
    if(isBlacklisted){
        return res.status(401).json({message: "Token is blacklisted - captain has logged out"});
    };

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debugging log
        const captain = await captainModel.findById(decoded.id);
        console.log("Captain found:", captain);
        if(!captain){
            return res.status(401).json({message: "Unauthorized access"});
        }
        req.captain = captain;
        console.log("Captain authenticated:", req.captain); // Debugging log
        return next();
    }catch(err){
        console.error("Error in authCaptain middleware:", err); // Debugging log
        return res.status(401).json({message: "Unauthorized access"});
    }
}