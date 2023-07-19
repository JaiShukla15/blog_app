const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const checkAuthToken = require('../middlewares/checkAuthToken');

router.get('/', checkAuthToken, chatController.getChats);

router.get('/:id', checkAuthToken, chatController.getChatMessages);

router.post('/:id/send', checkAuthToken, chatController.sendMessage);

module.exports = router;

