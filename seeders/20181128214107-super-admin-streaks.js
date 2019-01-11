'use strict';

// Use to format timestamps
const date = require('date-and-time')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity. */

      const dateObj = new Date()
      const now = date.format(dateObj, 'YYYY-MM-DD HH:mm:ss')
      const lastWeek = date.format(date.addDays(dateObj, -7), 'YYYY-MM-DD HH:mm:ss')
      const aMonthAgo = date.format(date.addMonths(dateObj, -1), 'YYYY-MM-DD HH:mm:ss')
      const inAWeek = date.format(date.addDays(dateObj, 7), 'YYYY-MM-DD HH:mm:ss')

      return queryInterface.bulkInsert('Streaks', [
        {
            name: 'Mark CSC309 projects',
            userId: 1,
            frequency: 2,
            period: 'day',
            totalSuccesses: 8, // See streak-history-seeder for a count
            totalFailures: 2,
            startDate: lastWeek,
            endDate: inAWeek,
            createdAt: now,
            updatedAt: now
        },
        {
            name: 'Go to the gym',
            userId: 1,
            frequency: 1,
            period: 'day',
            totalSuccesses: 28, // See streak-history-seeder for a count
            totalFailures: 2,
            startDate: aMonthAgo,
            endDate: inAWeek,
            createdAt: now,
            updatedAt: now
        },
      ], {})
  },
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity. */
      return queryInterface.bulkDelete('Streaks', null, {})
  }
};
