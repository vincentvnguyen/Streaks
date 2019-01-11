'use strict';

// Use to format timestamps
const date = require('date-and-time')

// Use bcrypt to generate password
const bcrypt = require('bcrypt')

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity. */

        const now = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')

        return queryInterface.bulkInsert('Users', [
            {
                // id is automatically handled
                name: 'Super Admin',
                username: 'root',
                password: bcrypt.hashSync('streaksrootpassword!', 5),
                email: 'root@example.com',
                userType: 'admin',
                createdAt: now,
                updatedAt: now
            },
            {
                name: 'Homer Simpson',
                username: 'homer',
                password: bcrypt.hashSync('homerspassword!', 5),
                email: 'homer@burnsnuclear.net',
                userType: 'user',
                createdAt: now,
                updatedAt: now
            },
    ], {})
    },
    down: (queryInterface, Sequelize) => {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity. */

        return queryInterface.bulkDelete('Users', null, {})
    }
}
