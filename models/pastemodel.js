const mongoose = require("mongoose");
let shortid = require("shortid");
let paste = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    requried: false
  },
  secret: {
    type: String,
    required: true,
    default: shortid.generate,
    unique: true
  },
  language: {
    type: String,
    required: true,
    default: "text"
  }
});
module.exports = mongoose.model("paste", paste);
