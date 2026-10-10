const { Motorista, Veiculo } = require('../models');

// --- GESTÃO DE MOTORISTAS ---
const adicionarMotorista = async (req, res) => {
  try {
    const { nome, cnh, telefone } = req.body;
    const novoMotorista = await Motorista.create({ nome, cnh, telefone });
    return res.status(201).json(novoMotorista);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao guardar motorista.' });
  }
};

const listarMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.findAll();
    return res.status(200).json(motoristas);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao listar motoristas.' });
  }
};

const atualizarMotorista = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnh, telefone } = req.body;
    await Motorista.update({ nome, cnh, telefone }, { where: { id } });
    return res.status(200).json({ mensagem: 'Motorista atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao atualizar motorista.' });
  }
};

// --- GESTÃO DE VEÍCULOS ---
const adicionarVeiculo = async (req, res) => {
  try {
    const { placa, modelo, capacidade_peso, capacidade_vol } = req.body;
    const novoVeiculo = await Veiculo.create({ placa, modelo, capacidade_peso, capacidade_vol });
    return res.status(201).json(novoVeiculo);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao guardar veículo.' });
  }
};

const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await Veiculo.findAll();
    return res.status(200).json(veiculos);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao listar veículos.' });
  }
};

const atualizarVeiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, capacidade_peso, capacidade_vol } = req.body;
    await Veiculo.update({ placa, modelo, capacidade_peso, capacidade_vol }, { where: { id } });
    return res.status(200).json({ mensagem: 'Veículo atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao atualizar veículo.' });
  }
};

module.exports = { 
  adicionarMotorista, listarMotoristas, atualizarMotorista,
  adicionarVeiculo, listarVeiculos, atualizarVeiculo
};