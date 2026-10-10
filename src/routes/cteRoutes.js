const express = require('express');
const multer = require('multer');
const cteController = require('../controllers/cteController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/importar', upload.single('arquivo'), cteController.uploadCte);
router.get('/', cteController.listarCtes);

module.exports = router;