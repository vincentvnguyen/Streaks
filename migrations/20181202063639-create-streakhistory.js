'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StreakHistory', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      streakId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      outcome: Sequelize.STRING,
      successes: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      failures: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StreakHistory');
  }
};
