const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  vehicle,
}) => {

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !vehicle?.color ||
    !vehicle?.plate ||
    !vehicle?.capacity ||
    !vehicle?.vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });

  return captain;
};
