const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid username or password.');
            }
        } else {
            res.status(401).send('Invalid username or password.');
        }
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

router.get('/userProfile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }, 'profileImage');
        if (user) {
            res.json({ profileImage: user.profileImage });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching user profile: ' + error.message);
    }
});

module.exports = router;