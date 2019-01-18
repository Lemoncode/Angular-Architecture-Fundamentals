const Message = require('./Message');

const messages = [];

exports.keylist = () => (
    new Promise((resolve, reject) => {
        resolve(Object.keys(messages))
    })
);

exports.create = (socketId) => (id, author, body) => (
    new Promise((resolve, reject) => {
        messages[id] = new Message(id, author, body); 
        resolve(messages[id]);
    })
).then((newMessage) => {
    console.log(messages);
    exports.events.messageCreated({
        id: newMessage.id,
        author: newMessage.author,
        body: newMessage.body,
        socketId
    });
    return newMessage;
});

exports.read = (key) => (
    new Promise((resolve, reject) => {
        if (messages[key]) {
            resolve(messages[key]);
        } else {
            reject(`message ${key} does not exist`);
        }
    })
)

exports.events = require('./messages-events');