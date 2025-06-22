const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const noteController = require('../controllers/noteController');

router.post('/upload', upload.single('file'), noteController.uploadNote);
router.get('/', noteController.getNotes);
router.delete('/:id',noteController.deleteNote);

module.exports = router;