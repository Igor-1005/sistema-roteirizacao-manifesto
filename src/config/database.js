require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // Coloque 'console.log' se quiser ver as queries SQL no terminal
    define: {
      timestamps: true, // Garante que created_at e updated_at sejam criados automaticamente
      underscored: true, // Usa o padrão snake_case no banco (ex: criado_por em vez de criadoPor)
    },
  }
);

module.exports = sequelize;