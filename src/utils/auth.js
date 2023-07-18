const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Middleware to verify JWT
function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Invalid or missing authorization header" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Assuming you have a secret key used for signing the JWT
  const secretKey = process.env.jwt_secret;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Optionally, you can attach the decoded user data to the request
    req.user = decoded;
    next();
  });
}

// Function to hash a password
async function hashPassword(plainPassword) {
  const saltRounds = 10; // You can adjust this value based on your security requirements
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Function to verify a password against its hashed version
async function verifyPassword(plainPassword, hashedPassword) {
  const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return passwordMatch;
}

module.exports = {
  verifyJwt,
  hashPassword,
  verifyPassword,
};
