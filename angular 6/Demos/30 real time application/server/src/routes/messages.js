const express = require('express');
const router = express.Router();
const messages = require('../models/message-repository');
const namespaces = require('../namespaces/index');

// post: /api/messages/write
router
    .post('/write', (req, res, next) => {
        messages
            .create(req.body.socketId)
            (
                req.body.id,
                req.body.name,
                req.body.body, 
            )
            .then(() => res.sendStatus(200))
            .catch((err) => {
                next(err);
            });
        
    });

module.exports = router;
module.exports.socketio = (io) => {
    namespaces.chat(messages, io);
}