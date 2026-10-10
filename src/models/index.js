const sequelize = require('../config/database');

// Importar todos os Models
const Usuario = require('./Usuario');
const Base = require('./Base');
const Veiculo = require('./Veiculo');
const Motorista = require('./Motorista');
const Rota = require('./Rota');
const Cte = require('./Cte');

// --- Relacionamentos da Operação ---

// Veículo e Rota
Veiculo.hasMany(Rota, { foreignKey: 'veiculo_id' });
Rota.belongsTo(Veiculo, { foreignKey: 'veiculo_id' });

// Motorista e Rota
Motorista.hasMany(Rota, { foreignKey: 'motorista_id' });
Rota.belongsTo(Motorista, { foreignKey: 'motorista_id' });

// Rota e Cte
Rota.hasMany(Cte, { foreignKey: 'rota_id' });
Cte.belongsTo(Rota, { foreignKey: 'rota_id' });

// Base e Cte
Base.hasMany(Cte, { foreignKey: 'base_id' });
Cte.belongsTo(Base, { foreignKey: 'base_id' });

// --- Relacionamentos de Auditoria (Quem criou e quem atualizou) ---
const modelsAuditoria = [Base, Veiculo, Motorista, Rota, Cte];

modelsAuditoria.forEach(model => {
  Usuario.hasMany(model, { foreignKey: 'criado_por' });
  model.belongsTo(Usuario, { as: 'Criador', foreignKey: 'criado_por' });

  Usuario.hasMany(model, { foreignKey: 'atualizado_por' });
  model.belongsTo(Usuario, { as: 'Atualizador', foreignKey: 'atualizado_por' });
});

// Exporta o sequelize e os models para usar no resto do sistema
module.exports = {
  sequelize,
  Usuario,
  Base,
  Veiculo,
  Motorista,
  Rota,
  Cte
};