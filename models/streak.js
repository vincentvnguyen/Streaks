'use strict';

module.exports = (sequelize, DataTypes) => {
  const Streak = sequelize.define('Streak', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    // The 'frequency' of a streak is how often the user intends to complete it,
    // i.e. if the goal is twice per week, the frequency would be 2 and the
    // period would be 'week'
    frequency: DataTypes.INTEGER,
    period: DataTypes.STRING,
    totalSuccesses: DataTypes.INTEGER,
    totalFailures: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {});
  Streak.associate = function(models) {
    // No need to define streak->user relationship here, it's defined in the User model
    Streak.hasMany(models.StreakHistory, { as: 'streakHistory', sourceKey: 'id', foreignKey: 'streakId' })
  };
  return Streak;
};
