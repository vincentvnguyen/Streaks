'use strict';

// Use to format timestamps
const date = require('date-and-time')

module.exports = {
    up: (queryInterface, Sequelize) => {

        const dateObj = new Date()
        const now = date.format(dateObj, 'YYYY-MM-DD HH:mm:ss')
        const lastWeek = date.format(date.addDays(dateObj, -7), 'YYYY-MM-DD HH:mm:ss')
        const aMonthAgo = date.format(date.addMonths(dateObj, -1), 'YYYY-MM-DD HH:mm:ss')
        const inAWeek = date.format(date.addDays(dateObj, 7), 'YYYY-MM-DD HH:mm:ss')

        return queryInterface.bulkInsert('StreakHistory', [
            // Streak 1
            {
                userId: 1,
                streakId: 1,
                outcome: 'success',
                successes: 6, // 2 successes per day for 3 days
                failures: 0,
                startDate: date.format(date.addDays(dateObj, -6), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -3), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -6), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -6), 'YYYY-MM-DD HH:mm:ss')
            },
            // One day failure
            {
                userId: 1,
                streakId: 1,
                outcome: 'failure',
                successes: 0,
                failures: 2, // 2 failures (the whole day was a failure)
                startDate: date.format(date.addDays(dateObj, -3), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -2), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -2), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -2), 'YYYY-MM-DD HH:mm:ss')
            },
            // Yesterday was a success
            {
                userId: 1,
                streakId: 1,
                outcome: 'success',
                successes: 2, // 2 successes (yesterday was a full success)
                failures: 0,
                startDate: date.format(date.addDays(dateObj, -2), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss')
            },
            // Streak 2
            {
                userId: 1,
                streakId: 2,
                outcome: 'success',
                successes: 15,
                failures: 0,
                startDate: date.format(date.addDays(dateObj, -30), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -15), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -15), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -15), 'YYYY-MM-DD HH:mm:ss')
            },
            {
                userId: 1,
                streakId: 2,
                outcome: 'failure',
                successes: 0,
                failures: 1,
                startDate: date.format(date.addDays(dateObj, -15), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -14), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -14), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -14), 'YYYY-MM-DD HH:mm:ss')
            },
            {
                userId: 1,
                streakId: 2,
                outcome: 'success',
                successes: 15,
                failures: 0,
                startDate: date.format(date.addDays(dateObj, -14), 'YYYY-MM-DD HH:mm:ss'),
                endDate: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss'),
                createdAt: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss'),
                updatedAt: date.format(date.addDays(dateObj, -1), 'YYYY-MM-DD HH:mm:ss')
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete('People', null, {});
        */
    }
};
