const {
  sendMessage,
  getMessages,
  getMessagesById,
  readMessage,
  getUsersWithMessages,
  getMessagesBySender,
} = require("../../controllers/inbox");
const { verifyJwt } = require("../../utils/auth");

module.exports = function registerInboxRoutes(app) {
  app.get("/api/messages", verifyJwt, getMessages);
  app.post("/api/messages/:id", getMessagesById);
  app.post("/api/messages/:id/read", readMessage);
  app.post("/api/messages", verifyJwt, sendMessage);
  app.get("/api/messages/senders", verifyJwt, getUsersWithMessages);
  app.get("/api/:username/messages", verifyJwt, getMessagesBySender);
};
