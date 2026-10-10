require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Importação das rotas (apenas uma vez cada)
const cteRoutes = require('./routes/cteRoutes');
const frotaRoutes = require('./routes/frotaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Ligação das rotas ao servidor
app.use('/api/ctes', cteRoutes);
app.use('/api/frota', frotaRoutes);

app.get('/', (req, res) => {
  res.send('API de Logística a funcionar perfeitamente!');
});

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log('📦 Base de Dados Sincronizada e Tabelas Criadas!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('❌ Erro ao sincronizar a base de dados:', erro);
  });