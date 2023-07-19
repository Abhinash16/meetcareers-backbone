const { Users } = require("../../models/users/users");
const jsonwebtoken = require("jsonwebtoken");
const { generateUniqueId } = require("../../utils/misc");
const { hashPassword, verifyPassword } = require("../../utils/auth");
const { Followers } = require("../../models/users/followers");

/**
 * create vehicle
 *
 * @param {Request} request
 * @param {Response} response
 */

const createUser = async function (request, response) {
  const { name, username, phone, email, password } = request.body;
  if (!name || !username || !phone || !email || !password) {
    return response.status(200).send({
      error: 1,
      message: "All the fields are required.",
    });
  }
  try {
    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);

    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return response.status(200).send({
        error: 1,
        message: "Username already taken.",
      });
    }
    const user = await Users.create({
      name,
      username,
      phone,
      email,
      status: 0,
      uid: generateUniqueId(),
      password: hashedPassword,
    });
    const jwtOptions = {
      audience: process.env.jwt_audience,
      issuer: process.env.jwt_issuer,
      expiresIn: process.env.jwt_expiry,
    };
    const jwtToken = jsonwebtoken.sign(
      { ...user._doc },
      process.env.jwt_secret,
      jwtOptions
    );
    return response.status(200).send({
      user: user,
      token: jwtToken,
    });
  } catch (err) {
    console.log(err);
    return response.status(500).send(err);
  }
};

const getUser = async function (request, response) {
  let username = request.user.username;
  console.log(username);
  try {
    const user = await Users.findOne({ username });
    response.status(200).send(user);
  } catch (err) {
    response.status(500).send(err);
  }
};

const getUsers = async function (request, response) {
  if (!request.user) {
    return response.status(404).json({ error: 1, message: "User not found" });
  }
  const page = request.query.page || 1;
  const pageSize = 10; // Number of items per page
  const skip = (page - 1) * pageSize;

  try {
    const currentUserId = request.user._id; // Assuming you have the user ID from authentication

    // Fetch all users from the 'users' collection
    const users = await Users.find()
      .select("-password")
      .skip(skip)
      .limit(pageSize);

    // Check if each user is followed by the current user
    const usersWithFollowedStatus = await Promise.all(
      users.map(async (user) => {
        const followed = await Followers.exists({
          followerId: currentUserId,
          followeeId: user._id,
        });
        const isUserAccount = currentUserId == user._id ? true : false;
        return {
          _id: user._id,
          username: user.username,
          name: user.name,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          email: user.email,
          status: user.status,
          isFollowing: followed ? true : false,
          isUserAccount: isUserAccount,
        };
      })
    );
    response.json({ users: usersWithFollowedStatus });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const authLogin = async function (request, response) {
  const { username, password } = request.body;
  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return response
        .status(200)
        .send({ error: 1, message: "Invalid username" });
    }
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return response
        .status(200)
        .json({ error: 1, message: "Invalid Password" });
    }
    const jwtOptions = {
      audience: process.env.jwt_audience,
      issuer: process.env.jwt_issuer,
      expiresIn: process.env.jwt_expiry,
    };
    const jwtToken = jsonwebtoken.sign(
      { ...user._doc },
      process.env.jwt_secret,
      jwtOptions
    );
    let userResponse = {
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
    };
    return response.status(200).send({
      error: 0,
      user: userResponse,
      token: jwtToken,
    });
  } catch (err) {
    response.status(500).send(err);
  }
};

const checkUsername = async function (request, response) {
  const { username } = request.body;
  try {
    const user = await Users.find({
      username,
    });
    let resp = {};
    if (user) {
      resp.status = 1;
      resp.message = "Username is available";
    } else {
      resp.status = 0;
      resp.message = "Username is unavailable";
    }
    response.status(200).send(resp);
  } catch (err) {
    response.status(500).send(err);
  }
};

const followUser = async function (request, response) {
  if (!request.user) {
    return response.status(401);
  }
  let followerId = request.user._id;
  const { username } = request.body;
  const profile = await Users.findOne({ username }).select("-password ");
  if (!profile) {
    return response.status(404).json({ error: "Profile not found" });
  }
  let followeeId = profile._id;
  try {
    const isFollowed = await Followers.exists({
      followerId,
      followeeId,
    });
    if (isFollowed) {
      return response.json({
        error: 1,
        message: "User already followed",
      });
    }
    const newFollower = await Followers.create({ followerId, followeeId });
    return response.json({
      message: "User followed successfully",
      newFollower,
    });
  } catch (err) {
    response.status(500).send(err);
  }
};

const unfollowUser = async function (request, response) {
  if (!request.user) {
    return response.status(401);
  }
  let followerId = request.user._id;
  const { username } = request.body;
  const profile = await Users.findOne({ username }).select("-password ");
  if (!profile) {
    return response
      .status(404)
      .json({ error: 1, message: "Profile not found" });
  }
  let followeeId = profile._id;
  try {
    const isFollowed = await Followers.exists({
      followerId,
      followeeId,
    });
    if (!isFollowed) {
      return response.json({
        error: true,
        message: "User already unfollowed",
      });
    }
    const newFollower = await Followers.findOneAndDelete({
      followerId,
      followeeId,
    });
    return response.json({
      message: "User unfollowed successfully",
      newFollower,
    });
  } catch (err) {
    response.status(500).send(err);
  }
};

const profileLookup = async function (request, response) {
  if (!request.user) {
    return response.status(401).json({ error: "Not Authorised" });
  }
  const username = request.params.username;
  const userId = request.user._id;

  try {
    // Find the profile information from the 'profiles' collection
    const profile = await Users.findOne({ username }).select("-password ");
    if (!profile) {
      return response.status(404).json({ error: "Profile not found" });
    }
    const profileId = profile._id;
    let isUserAccount = false;

    if (userId == profileId) {
      isUserAccount = true;
    }
    // Check if the profile is followed by the logged-in user
    const isFollowed = await Followers.exists({
      followerId: userId,
      followeeId: profileId,
    });

    // Calculate the number of followers for the user
    const followersCount = await Followers.countDocuments({
      followeeId: profileId,
    });

    // Calculate the number of users the user is following
    const followingCount = await Followers.countDocuments({
      followerId: profileId,
    });

    // Add the follow status to the profile object
    const profileWithFollowStatus = {
      ...profile.toObject(),
      isFollowed: isFollowed ? true : false,
      followersCount,
      followingCount,
      isUserAccount,
    };
    return response.json({ ...profileWithFollowStatus });
  } catch (err) {
    console.error("Error getting profile:", err);
    return response.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  getUser,
  checkUsername,
  followUser,
  unfollowUser,
  authLogin,
  profileLookup,
  getUsers,
};
