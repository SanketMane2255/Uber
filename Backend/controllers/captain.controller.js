const blacklistTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  console.log("Registering captain 1 :", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const hashedPassword = await captainModel.hashPassword(password);

  const isCaptainExist = await captainModel.findOne({ email });
  if (isCaptainExist) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;

  const captain = await captainModel.findOne({email}).select('+password');

  if (!captain) {
    return res.status(400).json({message: "Invalid email or password"});
  };

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({message: "Invalid email or password"});
  }

  const token = captain.generateAuthToken();

  res.cookie('token', token);

  res.status(200).json({token, captain});

}

module.exports.getCaptainProfile = async(req,res,next) => {
  const captain = req.captain;

  if(!captain){
    return res.status(404).json({message: "Captain not found"});
  }
  res.status(200).json({captain});
}

module.exports.logoutCaptain = async(req,res,next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({token: token});

  res.clearCookie('token');

  res.status(200).json({message: "Captain logged out successfully"});
}
