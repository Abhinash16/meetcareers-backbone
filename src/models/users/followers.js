const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const followersSchema = new mongoose.Schema(
  {
    followerId: { type: ObjectId, required: true },
    followeeId: { type: ObjectId, required: true },
  },
  { timestamps: true }
);
const followersSchemaModel = mongoose.model("followers", followersSchema);
module.exports.Followers = followersSchemaModel;
