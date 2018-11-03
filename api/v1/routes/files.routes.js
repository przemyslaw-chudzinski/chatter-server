const express = require('express');
const router = express.Router();
const filesController = require('../../../controllers/files/files.controller');
/**
 * @desc It uploads files to the store
 */
router.post('/upload-files', (req, res) => new filesController.UploadFilesAction(req, res));

module.exports = router;