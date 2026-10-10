const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rota = sequelize.define('Rota', {
  data_rota: { type: DataTypes.DATEONLY, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Em Montagem', 'Em Trânsito', 'Finalizada'), 
    defaultValue: 'Em Montagem' 
  }
});

module.exports = Rota;