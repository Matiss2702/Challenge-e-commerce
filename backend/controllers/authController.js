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
const RESET_PASSWORD_EXPIRES_IN = "15m";

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

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await UserMongo.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: RESET_PASSWORD_EXPIRES_IN });

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
      <h2>Réinitialisation du mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetLink}">${resetLink}</a>
      <p><small>Ce lien expirera dans 15 minutes.</small></p>
    `;

    await sendEmail(user.email, "Réinitialisation du mot de passe", html);

    return res.status(200).json({ message: "Email de réinitialisation envoyé." });
  } catch (error) {
    console.error("Erreur lors de la demande de reset password:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Réinitialiser le mot de passe
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userMongo = await UserMongo.findById(decoded.id);
    if (!userMongo) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userMongo.password = hashedPassword;
    await userMongo.save();

    // Synchroniser avec Postgres
    await User.update({ password: hashedPassword }, { where: { id: userMongo.postgresId } });

    return res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Lien expiré. Merci de recommencer." });
    }
    return res.status(500).json({ message: "Erreur serveur" });
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
