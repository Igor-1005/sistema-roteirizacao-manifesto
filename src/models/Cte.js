const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cte = sequelize.define('Cte', {
  chave_acesso: { type: DataTypes.STRING, allowNull: false, unique: true },
  nota_fiscal: { type: DataTypes.STRING, allowNull: false },
  cnpj_destinatario: { type: DataTypes.STRING, allowNull: false },
  destinatario: { type: DataTypes.STRING, allowNull: false },
  endereco_entrega: { type: DataTypes.STRING, allowNull: false },
  lat_entrega: { type: DataTypes.DECIMAL(10, 8) },
  lng_entrega: { type: DataTypes.DECIMAL(11, 8) },
  peso: { type: DataTypes.FLOAT, allowNull: false },
  volume: { type: DataTypes.FLOAT, allowNull: false },
  valor_nota: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  valor_cte: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { 
    type: DataTypes.ENUM('Pendente', 'Em Rota', 'Entregue', 'Ocorrência'), 
    defaultValue: 'Pendente' 
  },
  ordem_entrega: { type: DataTypes.INTEGER },
  url_comprovante: { type: DataTypes.STRING }
});

module.exports = Cte;