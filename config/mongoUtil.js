const mongoose = require("mongoose");
require("dotenv").config();

const db_url = `mongodb://localhost:27017/meetcareers?retryWrites=true&w=majority&authSource=admin`;

// const db_url = `mongodb://${process.env.db_cluster_link}/${process.env.db_name}?retryWrites=true&w=majority&authSource=admin`;
console.log(db_url);

module.exports = {
  connectToServer: function (callback) {
    // mongoose.set("useCreateIndex", true);
    mongoose
      .connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // auth: {
        //   user: process.env.db_username,
        //   password: process.env.db_password,
        // },
      })
      .then(() => {
        console.log(
          `Connected to database.`
          //   `Connected to ${process.env.db_username}:${process.env.db_name} database.`
        );
        // mongoose.connection.db.listCollections().toArray(function (err, names){
        //    console.log(names);
        // })
      })
      .catch((err) => console.error("Could not connect to MongoDB...", err));
  },
};
