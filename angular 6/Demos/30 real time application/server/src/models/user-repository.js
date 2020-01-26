const User = require('./User');

let users = [];

exports.create = (id, name) => (
    new Promise((resolve, reject) => {
        const user = new User(id, name);
        users = [...users, user];
        resolve(user);
    })
);

exports.restrieveUsers = () => (
    new Promise((resolve, reject) => {
        resolve(users);
    })
);