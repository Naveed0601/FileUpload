const express = require('express');
const router = express.Router();
const multer = require('multer');
const { FileUpload , GetFiles , DownloadFile, SecretKey, GetOneFile } = require('../controllers/FileController');
const { ApiTest } = require('../controllers/ApiController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), FileUpload);
router.get('/getfiles' , GetFiles);
router.get('/download/:fileName' , DownloadFile);
router.post('/api' , ApiTest);
router.get('/key' , SecretKey);
router.get('/onefile/:filename' , GetOneFile);

module.exports = router;
