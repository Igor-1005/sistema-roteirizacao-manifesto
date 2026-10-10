const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha_hash: { type: DataTypes.STRING, allowNull: false },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Usuario;