const { Application } = require("express");
const { getUsers, createUser } = require("../../controllers/users");
/**
 * Registers all users routes
 * @param {Application} app
 */
module.exports = function registerUsersRoutes(app) {
  app.get("/api/users", getUsers);
  app.post("/api/users", createUser);
};
