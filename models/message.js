const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    message: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model("Messages", MessagesSchema);