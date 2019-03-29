const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});
                     // mongoose.model('MUST BE API FILE NAME', UserSchema);
module.exports = Auth = mongoose.model('auth', UserSchema);