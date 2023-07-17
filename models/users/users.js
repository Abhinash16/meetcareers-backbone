const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    phone: String,
    email: String,
    status: Number,
  },
  { timestamps: true }
);
const usersSchemaModel = mongoose.model("users", usersSchema);
module.exports.Users = usersSchemaModel;
