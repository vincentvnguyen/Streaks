'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Streaks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: Sequelize.INTEGER,
      name: Sequelize.STRING,
      // See the Streak model for docs on these attributes
      frequency: Sequelize.INTEGER,
      period: Sequelize.STRING,
      totalSuccesses: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      totalFailures: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      startDate: Sequelize.DATE,
      endDate: Sequelize.DATE,
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
    return queryInterface.dropTable('Streaks');
  }
};
