const fs = require('fs');
const path = require('path');

const models = {};
const files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (file !== 'index.js') {
    const model = require(path.join(__dirname, file));
    models[model.modelName] = model;
  }
});

module.exports = models;
