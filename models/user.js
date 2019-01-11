'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name    : DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    email:    { type: DataTypes.STRING, unique: true },
    userType: DataTypes.STRING, // either 'user' or 'admin' (no enum in sqlite)
    password: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    // User owns many Streaks
    User.hasMany(models.Streak, { as: 'Streaks', sourceKey: 'id', foreignKey: 'userId' })
  };
  return User;
};
