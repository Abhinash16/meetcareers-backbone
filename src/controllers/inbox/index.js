const { Inbox } = require("../../models/inboxModels/inbox");
const { Users } = require("../../models/users/users");

const getMessages = async function (request, response) {
  const receiverId = request.user._id;
  try {
    const messages = await Inbox.find({ receiver: receiverId }).populate(
      "sender",
      "-_id username name email"
    );
    response.json(messages);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const getUsersWithMessages = async function (request, response) {
  const receiverId = request.user._id;
  try {
    const loggedInUserId = receiverId;
    const ids = await Inbox.distinct("sender", {
      receiver: loggedInUserId,
    });

    const senders = await Users.find({
      _id: {
        $in: ids,
      },
    }).select("-_id -password");

    response.json(senders);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessagesBySender = async function (request, response) {
  const { username } = request.params;
  if (!username) {
    return response
      .status(200)
      .send({ error: 1, message: "username not found" });
  }
  const user = await Users.findOne({ username });
  if (!user) {
    return response.status(200).send({ error: 1, message: "Invalid username" });
  }
  const sender = user._id;
  const receiverId = request.user._id;

  try {
    const messages = await Inbox.find({
      $or: [
        { receiver: receiverId, sender: sender },
        { receiver: sender, sender: receiverId },
      ],
    }).populate("sender", "-_id username name email");
    response.json(messages);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessagesById = async function (request, response) {
  const receiverId = request.user._id;
  try {
    const messageId = req.params.id;
    const message = await Inbox.findById(messageId).populate(
      "sender",
      "name email"
    );
    if (message) {
      response.json(message);
    } else {
      response.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const readMessage = async function (request, response) {
  try {
    const messageId = req.params.id;
    const message = await Inbox.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
    if (message) {
      response.json(message);
    } else {
      response.status(404).json({ error: 1, message: "Message not found" });
    }
  } catch (err) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMessage = async function (request, response) {
  if (!request.user) {
    return response.status(404).json({ error: 1, message: "User not found" });
  }
  try {
    const senderId = request.user._id;
    const { subject, content, username } = request.body;
    const user = await Users.findOne({ username });
    if (!user) {
      return response
        .status(200)
        .send({ error: 1, message: "Invalid username" });
    }
    const receiver = user._id;
    const newMessage = new Inbox({
      sender: senderId,
      receiver,
      subject,
      content,
    });
    await newMessage.save();
    response.status(201).json(newMessage);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getMessages,
  getMessagesById,
  readMessage,
  sendMessage,
  getUsersWithMessages,
  getMessagesBySender,
};
