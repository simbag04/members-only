const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, maxLength: 100, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false },
    member: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("User", UserSchema);