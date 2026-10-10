const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Base = sequelize.define('Base', {
  razao_social: { type: DataTypes.STRING, allowNull: false },
  cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
  endereco_coleta: { type: DataTypes.STRING, allowNull: false },
  lat_coleta: { type: DataTypes.DECIMAL(10, 8) },
  lng_coleta: { type: DataTypes.DECIMAL(11, 8) }
});

module.exports = Base;