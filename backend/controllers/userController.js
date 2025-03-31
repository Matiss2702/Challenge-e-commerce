const sequelize = require("../config/sequelize");
const UserPostgres = require("../models/postgres/User")(sequelize);
const UserMongo = require("../models/mongo/UserMongo");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserMongo.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const postgresId = req.params.id;

    const userPostgres = await UserPostgres.findByPk(postgresId);
    if (!userPostgres) {
      return res.status(404).json({ message: "User not found in PostgreSQL" });
    }

    const userMongo = await UserMongo.findOne({ postgresId });
    if (!userMongo) {
      return res.status(404).json({ message: "User not found in MongoDB" });
    }

    res.json({
      postgresData: userPostgres,
      mongoData: userMongo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, birthdate, email, password, role } = validation.data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Creating user in PostgreSQL...");
    const newUserPostgres = await UserPostgres.create({
      name,
      birthdate,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Creating user in MongoDB...");
    const newUserMongo = new UserMongo({
      postgresId: newUserPostgres.id,
      name,
      email,
      birthdate,
      password: hashedPassword,
      role,
    });

    await newUserMongo.save();

    res.status(201).json(newUserPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const postgresId = req.params.id;

    const userMongo = await UserMongo.findOne({ postgresId });
    if (!userMongo) {
      return res.status(404).json({ message: "User not found in MongoDB" });
    }

    const validation = userSchema.omit({ password: true }).safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, birthdate, email, role } = validation.data;

    const userPostgres = await UserPostgres.findByPk(postgresId);
    if (!userPostgres) {
      return res.status(404).json({ message: "User not found in PostgreSQL" });
    }

    userPostgres.name = name;
    userPostgres.birthdate = birthdate;
    userPostgres.email = email;
    userPostgres.role = role;

    await userPostgres.save();

    const updateFields = { name, birthdate, email, role };
    await UserMongo.findOneAndUpdate({ postgresId: userPostgres.id }, updateFields);

    res.json(userPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const postgresId = req.params.id;
    const { name, birthdate, email, currentPassword, newPassword } = req.body;

    const userPostgres = await UserPostgres.findByPk(postgresId);
    if (!userPostgres) {
      return res.status(404).json({ message: "Utilisateur non trouvé dans PostgreSQL" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, userPostgres.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Ancien mot de passe incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      userPostgres.password = hashedPassword;
    }

    userPostgres.name = name;
    userPostgres.birthdate = birthdate;
    userPostgres.email = email;

    await userPostgres.save();

    const userMongo = await UserMongo.findOne({ postgresId: userPostgres.id });
    if (!userMongo) {
      return res.status(404).json({ message: "Utilisateur non trouvé dans MongoDB" });
    }

    userMongo.name = name;
    userMongo.birthdate = birthdate;
    userMongo.email = email;

    if (currentPassword && newPassword) {
      userMongo.password = userPostgres.password;
      console.log("Nouveau mot de passe haché:", userPostgres.password);
      console.log("Mot de passe sauvegardé dans MongoDB:", userMongo.password);
    }

    await userMongo.save();

    res.json({
      postgresData: userPostgres,
      mongoData: userMongo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userPostgres = await UserPostgres.findByPk(req.params.id);
    if (!userPostgres) {
      return res.status(404).json({ message: "User not found" });
    }

    await userPostgres.destroy();
    await UserMongo.findOneAndDelete({ postgresId: userPostgres.id });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
