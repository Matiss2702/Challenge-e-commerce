const UserPostgres = require('../models/postgres/User');
const UserMongo = require('../models/mongo/UserMongo');
const userSchema = require('../schemas/userSchema');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserMongo.find();
    res.json(users);
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
  
      const { name, email, password, role } = validation.data;
      const newUserPostgres = await UserPostgres.create({ name, email, password, role });
  
      const newUserMongo = new UserMongo({
        postgresId: newUserPostgres.id,
        name,
        email,
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
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, email, password, role } = validation.data;

    const userPostgres = await UserPostgres.findByPk(req.params.id);
    if (!userPostgres) {
      return res.status(404).json({ message: 'User not found' });
    }

    userPostgres.name = name;
    userPostgres.email = email;
    userPostgres.password = password;
    userPostgres.role = role;
    await userPostgres.save();

    await UserMongo.findOneAndUpdate(
      { postgresId: userPostgres.id },
      { name, email, role }
    );

    res.json(userPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userPostgres = await UserPostgres.findByPk(req.params.id);
    if (!userPostgres) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userPostgres.destroy();
    await UserMongo.findOneAndDelete({ postgresId: userPostgres.id });

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
