const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/sequelize");
const User = require("../models/postgres/User")(sequelize);
const UserMongo = require("../models/mongo/UserMongo");
const userSchema = require("../schemas/userSchema");
const { sendEmail } = require("../services/mailService");
const dotenv = require("dotenv");

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, birthdate, email, password, role } = validation.data;
    const parsedBirthdate = new Date(birthdate);
    if (isNaN(parsedBirthdate.getTime())) {
      return res.status(400).json({ message: "Invalid birthdate format" });
    }

    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userMongo = await UserMongo.findOne({ email });
    if (userMongo) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      birthdate: parsedBirthdate,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    const newUserMongo = new UserMongo({
      postgresId: user.id,
      name,
      birthdate: parsedBirthdate,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });
    await newUserMongo.save();

    const token = jwt.sign({ id: newUserMongo._id }, JWT_SECRET, { expiresIn: "1d" });
    const verificationLink = `${FRONTEND_URL}/verify-account?token=${token}`;
    console.log("Verification link:", verificationLink);

    const emailContent = `
      <h1>Bienvenue ${name} !</h1>
      <p>Merci de vous être inscrit. Cliquez sur le lien suivant pour vérifier votre compte :</p>
      <a href="${verificationLink}">Vérifier mon compte</a>
    `;
    await sendEmail(email, "Bienvenue chez nous !", emailContent);

    res.status(201).json({ message: "User registered successfully. Please verify your email." });
  } catch (err) {
    console.error(`Error during user registration: ${err.message}`, err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userMongo = await UserMongo.findOne({ email });
    if (!userMongo) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!userMongo.isVerified) {
      const token = jwt.sign({ id: userMongo._id }, JWT_SECRET, { expiresIn: "1d" });
      const verificationLink = `${FRONTEND_URL}/verify-account?token=${token}`;
      const emailContent = `
        <h1>Votre compte n'est pas vérifié</h1>
        <p>Veuillez cliquer sur le lien suivant pour vérifier votre compte :</p>
        <a href="${verificationLink}">Vérifier mon compte</a>
      `;
      await sendEmail(email, "Vérification de compte requise", emailContent);
      return res.status(403).json({ message: "Account not verified. A verification email has been sent." });
    }

    const isMatch = await bcrypt.compare(password, userMongo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: userMongo._id.toString(), role: userMongo.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(`Error during login: ${err.message}`, err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserMongo.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    user.isVerified = true;
    await user.save();

    await User.update({ isVerified: true }, { where: { id: user.postgresId } });

    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    console.error("Error verifying token:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid or malformed token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserMongo.findOne({ postgresId: req.user.id }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(`Error fetching user info: ${err.message}`, err);
    res.status(500).json({ message: "Server error" });
  }
};
