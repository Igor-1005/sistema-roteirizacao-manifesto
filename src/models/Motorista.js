const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Motorista = sequelize.define('Motorista', {
  nome: { type: DataTypes.STRING, allowNull: false },
  cnh: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Motorista;