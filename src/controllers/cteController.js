const { XMLParser } = require('fast-xml-parser');
const { Base, Cte } = require('../models');

// Função auxiliar para buscar Latitude e Longitude
async function geocodificarEndereco(endereco) {
  try {
    // A API do Nominatim requer um formato específico e um User-Agent válido
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
    const resposta = await fetch(url, {
      headers: { 'User-Agent': 'AppLogistica/1.0 (seu_email@teste.com)' }
    });
    const dados = await resposta.json();
    
    if (dados && dados.length > 0) {
      return { lat: parseFloat(dados[0].lat), lng: parseFloat(dados[0].lon) };
    }
    return { lat: null, lng: null };
  } catch (erro) {
    console.error('Erro ao geocodificar:', erro);
    return { lat: null, lng: null };
  }
}

const uploadCte = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum ficheiro XML foi enviado.' });
    }

    const xmlBruto = req.file.buffer.toString('utf-8');
    const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });
    const jsonResult = parser.parse(xmlBruto);
    const infCte = jsonResult.cteProc?.CTe?.infCte;

    if (!infCte) {
      return res.status(400).json({ erro: 'XML inválido. Estrutura do CT-e não encontrada.' });
    }

    const chaveAcesso = infCte['@_Id'] ? infCte['@_Id'].replace('CTe', '') : '';
    
    // Verifica se já existe para evitar chamadas desnecessárias à API de mapas
    let cteExistente = await Cte.findOne({ where: { chave_acesso: chaveAcesso } });
    if (cteExistente) {
      return res.status(409).json({ erro: 'Este CT-e já foi importado no sistema anteriormente.' });
    }

    // Extração Base
    const remetente = infCte.rem;
    const cnpjBase = remetente.CNPJ;
    const nomeBase = remetente.xNome;
    const enderReme = remetente.enderReme;
    const enderecoBase = `${enderReme.xLgr}, ${enderReme.nro}, ${enderReme.xBairro}, ${enderReme.xMun} - ${enderReme.UF}`;

    // Extração Destinatário
    const dest = infCte.dest;
    const cnpjDestinatario = dest.CNPJ;
    const nomeDestinatario = dest.xNome;
    const ender = dest.enderDest;
    const cpl = ender.xCpl ? `- ${ender.xCpl}` : '';
    // Endereço simplificado para melhorar a precisão da geocodificação
    const enderecoEntrega = `${ender.xLgr}, ${ender.nro}, ${ender.xMun}, ${ender.UF}`; 
    const enderecoCompleto = `${ender.xLgr}, ${ender.nro} ${cpl}, ${ender.xBairro}, ${ender.xMun} - ${ender.UF}, CEP: ${ender.CEP}`;

    // Extração Valores e Pesos
    const valorFrete = parseFloat(infCte.vPrest?.vTPrest || 0);
    const valorNota = parseFloat(infCte.infCTeNorm?.infCarga?.vCarga || 0);
    let peso = 0, volume = 0;
    const infQ = infCte.infCTeNorm?.infCarga?.infQ || [];
    const quantidades = Array.isArray(infQ) ? infQ : [infQ];

    quantidades.forEach(q => {
      if (q.cUnid == 1 || q.tpMed === 'PESO BRUTO') peso = parseFloat(q.qCarga);
      if (q.cUnid == 3 || q.tpMed === 'CAIXAS' || q.tpMed === 'VOLUME') volume = parseFloat(q.qCarga);
    });

    const infNFe = infCte.infCTeNorm?.infDoc?.infNFe || [];
    const notas = Array.isArray(infNFe) ? infNFe : [infNFe];
    const notasFiscais = notas.map(n => {
      const chave = String(n.chave);
      return chave.length === 44 ? parseInt(chave.substring(25, 34), 10) : chave;
    }).join(', ');

    // 1. Geocodificar a morada da Base
    let base = await Base.findOne({ where: { cnpj: cnpjBase } });
    if (!base) {
      const coordsBase = await geocodificarEndereco(enderecoBase);
      base = await Base.create({
        razao_social: nomeBase,
        cnpj: cnpjBase,
        endereco_coleta: enderecoBase,
        lat_coleta: coordsBase.lat,
        lng_coleta: coordsBase.lng
      });
    }

    // 2. Geocodificar a morada do Destinatário
    const coordsEntrega = await geocodificarEndereco(enderecoEntrega);

    // 3. Guardar tudo na base de dados
    const novoCte = await Cte.create({
      chave_acesso: chaveAcesso,
      nota_fiscal: notasFiscais,
      cnpj_destinatario: cnpjDestinatario,
      destinatario: nomeDestinatario,
      endereco_entrega: enderecoCompleto,
      lat_entrega: coordsEntrega.lat,
      lng_entrega: coordsEntrega.lng,
      peso: peso,
      volume: volume,
      valor_nota: valorNota,
      valor_cte: valorFrete,
      base_id: base.id
    });

    return res.status(201).json({
      mensagem: 'CT-e importado e geocodificado com sucesso!',
      cte: novoCte
    });

  } catch (error) {
    console.error('Erro ao processar e salvar o XML:', error);
    return res.status(500).json({ erro: 'Falha interna ao ler ou salvar o ficheiro XML.' });
  }
};

const listarCtes = async (req, res) => {
  try {
    const ctes = await Cte.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(ctes);
  } catch (error) {
    console.error('Erro ao buscar CT-es:', error);
    return res.status(500).json({ erro: 'Falha interna ao buscar os dados.' });
  }
};

module.exports = { uploadCte, listarCtes };