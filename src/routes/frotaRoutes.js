const express = require('express');
const frotaController = require('../controllers/frotaController');

const router = express.Router();

// Motoristas
router.post('/motoristas', frotaController.adicionarMotorista);
router.get('/motoristas', frotaController.listarMotoristas);
router.put('/motoristas/:id', frotaController.atualizarMotorista);

// Veículos
router.post('/veiculos', frotaController.adicionarVeiculo);
router.get('/veiculos', frotaController.listarVeiculos);
router.put('/veiculos/:id', frotaController.atualizarVeiculo);

module.exports = router;