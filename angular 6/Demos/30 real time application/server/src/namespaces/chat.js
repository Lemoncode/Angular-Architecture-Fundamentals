module.exports = (messages, io) => {
    const getMessages = () => (
        messages.keylist()
            .then((keylist) => {
                const messagesPromises = keylist.map((key) =>
                    messages.read(key)
                        .then(
                            (message) => (
                                {
                                    id: message.id,
                                    author: message.author,
                                    body: message.body
                                }
                            )
                        )
                );
                return Promise.all(messagesPromises);
            })
    );
    const chat = io.of('/chat');

    chat.on('connection', (socket) => {
        console.log('connection added');
        getMessages()
            .then((messages) => {
                setTimeout(() => {
                    console.log(messages)
                    chat.emit('messages', messages);
                }, 1000);
            });
    });
    
    messages.events.on('messagecreated', (data) => {
        console.log(data);
        chat.emit('message', data);
    });
};