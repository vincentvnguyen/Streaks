'use strict';
module.exports = (sequelize, DataTypes) => {
  const StreakHistory = sequelize.define('StreakHistory', {
    userId: DataTypes.INTEGER,
    streakId: DataTypes.INTEGER,
    outcome: DataTypes.STRING,
    successes: DataTypes.INTEGER,
    failures: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {
    freezeTableName: true,
  });
  StreakHistory.associate = function(models) {
    // StreakHistory->Streak relationship defined in streak model

  };
  return StreakHistory;
};
