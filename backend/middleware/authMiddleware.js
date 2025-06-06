const jwt = require("jsonwebtoken");
const UserMongo = require("../models/mongo/UserMongo");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserMongo.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const userIdAsInt = parseInt(user.postgresId, 10);
    if (isNaN(userIdAsInt)) {
      return res.status(400).json({ message: "Invalid postgresId for user" });
    }

    req.user = {
      id: userIdAsInt,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
