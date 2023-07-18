const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const usersSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    phone: String,
    coverImageUrl: String,
    avatarUrl: String,
    email: String,
    status: Number,
    password: String,
    uid: String,
  },
  { versionKey: false },
  { timestamps: true }
);
const usersSchemaModel = mongoose.model("users", usersSchema);
module.exports.Users = usersSchemaModel;
