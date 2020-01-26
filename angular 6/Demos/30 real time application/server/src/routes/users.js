const express = require('express');
const router = express.Router();
const users = require('../models/user-repository');
const User = require('../models/User');

// TODO: Check if current user exist

const isRegistered = (userName) => (
    users.restrieveUsers()
        .then((users) =>
            users.map((u) => u.name)
                .some((n) => n === userName)
        )
);

// post: /api/users/register => { registered: boolean, info?: string, user?: user }
router
    .post('/register', (req, res, next) => {
        const { name } = req.body;
        isRegistered(name)
            .then((registered) => {
                if (!registered) {
                    const id = process.hrtime()[1];
                    return users.create(id, name);
                }
                
                return registered;
            })
            .then((result) => {
                if (result instanceof User) {
                    res.json({ registered: true,  user: result });
                } else {
                    res.json({ registered: false, info: 'selected name already used' });
                }
            })
            .catch((err) => next(err));
    });

module.exports = router;