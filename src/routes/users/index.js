const { Application } = require("express");
const {
  getUser,
  getUsers,
  createUser,
  checkUsername,
  followUser,
  unfollowUser,
  authLogin,
  profileLookup,
} = require("../../controllers/users");
const { verifyJwt } = require("../../utils/auth");
/**
 * Registers all users routes
 * @param {Application} app
 */
module.exports = function registerUsersRoutes(app) {
  app.post("/api/users", createUser);
  app.post("/api/auth/login", authLogin);
  app.get("/api/user/me", verifyJwt, getUser);
  app.post("/api/username/check", checkUsername);
  app.post("/api/follow", verifyJwt, followUser);
  app.post("/api/unfollow", verifyJwt, unfollowUser);
  app.get("/api/profile/:username", verifyJwt, profileLookup);
  app.get("/api/users", verifyJwt, getUsers);
};
