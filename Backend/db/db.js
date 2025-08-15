const mongoose = require('mongoose')



function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log("Error occured while connecting to db", err);
    })
}

module.exports = connectToDb;