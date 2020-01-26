const EventEmitter = require('events');
class MessagesEmitter extends EventEmitter{}
module.exports = new MessagesEmitter();

module.exports.messageCreated = (message) => {
    module.exports.emit('messagecreated', message);
};