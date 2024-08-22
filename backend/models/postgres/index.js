const fs = require("node:fs");
const path = require("node:path");
const sequelize = require("../../config/sequelize");
const Sequelize = require('sequelize');

const files = fs.readdirSync(__dirname);
const db = {
  sequelize,
};

for (const file of files) {
  if (["index.js", "db.js"].includes(file)) continue;
  const model = require(path.join(__dirname, file))(sequelize);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
