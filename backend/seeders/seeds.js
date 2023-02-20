const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 10;
const NUM_SEED_TWEETS = 30;

// Create users
const users = [];

users.push(
    new User({
        username: 'demo-user',
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10)
    })
)

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    users.push(
        new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10)
        })
    )
}

// Create tweets
const tweets = [];

for (let i = 0; i < NUM_SEED_TWEETS; i++) {
    tweets.push(
        new Tweet({
            text: faker.hacker.phrase(),
            author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        })
    )
}