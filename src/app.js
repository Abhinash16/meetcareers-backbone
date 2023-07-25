const express = require("express");
const { json, urlencoded } = require("body-parser");
var cors = require("cors");
var mongoUtil = require("../config/mongoUtil");
require("../config/firebaseUtil");

const registerUsersRoutes = require("./routes/users");
const registerInboxRoutes = require("./routes/inbox");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

io.on("connection", (socket) => {
  console.log("A user connected");
  // Handle incoming messages
  socket.on("chat message", (message) => {
    console.log("Message received: ", message);
    io.emit("chat message", message);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

mongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
});

app.use(require("./routes/blogs"));

registerUsersRoutes(app);
registerInboxRoutes(app);

const port = process.env.PORT || 3100;

http.listen(port, () => console.log(`Listening on port ${port}...`));
