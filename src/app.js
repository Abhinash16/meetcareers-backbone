const express = require("express");
const { json, urlencoded } = require("body-parser");
var cors = require("cors");
var mongoUtil = require("../config/mongoUtil");
const registerUsersRoutes = require("./routes/users");

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

mongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
});

registerUsersRoutes(app);

const port = process.env.PORT || 3100;

app.listen(port, () => console.log(`Listening on port ${port}...`));
