const { Users } = require("../../models/users/users");

/**
 * create vehicle
 *
 * @param {Request} request
 * @param {Response} response
 */

const createUser = async function (request, response) {
  const { name, username, phone, email } = request.body;
  if (!name || !username || !phone || !email) {
    return response.status(200).send({
      error: 1,
      message: "All the fields are required.",
    });
  }
  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return response.status(200).send({
        error: 1,
        message: "Username already taken.",
      });
    }
    const user = await Users.create({
      name: name,
      username: username,
      phone: phone,
      email: email,
      status: 0,
    });
    return response.status(200).send(user);
  } catch (err) {
    console.log(err);
    return response.status(500).send(err);
  }
};

const getUsers = async function (request, response) {
  try {
    const user = await Users.find();
    response.status(200).send(user);
  } catch (err) {
    response.status(500).send(err);
  }
};

module.exports = { createUser, getUsers };
