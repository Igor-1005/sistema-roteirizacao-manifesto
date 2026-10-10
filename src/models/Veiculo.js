const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Veiculo = sequelize.define('Veiculo', {
  placa: { type: DataTypes.STRING, allowNull: false, unique: true },
  modelo: { type: DataTypes.STRING, allowNull: false },
  capacidade_peso: { type: DataTypes.FLOAT, allowNull: false },
  capacidade_vol: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Veiculo;