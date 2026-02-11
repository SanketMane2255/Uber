const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type : String,
            required: true,
            minlength: [3, `Firstname must be at least 3 characters`],
        },
        lastname: {
            type: String,
             minlength: [3, `Lasttname must be at least 3 characters`],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, `Email must be at least 5 characters`],
    },
    password: {
        type: String,
        required: true,
        select: false,// used to hide the password when we fetch the user data
    },
    socketId: {
        type: String,
    }
    // We are using socketId to share the live location
})


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}




const userModel = mongoose.model('user', userSchema);

module.exports = userModel;