const express = require('express'),
    http = require('http'),
    app = express(),
    bodyParser = require('body-parser')
    cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(cors());

const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

// /users
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

const server = require('http').Server(app);

const io = require('socket.io')(server);
messagesRouter.socketio(io);
const port = 3001;
console.log(`Server listen at: ${port}`);
server.listen(port);