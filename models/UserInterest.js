const { Model, Sequelize } = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const UserInterest = Sequelize.define('UserInterest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id"
      }
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });

  UserInterest.associate = db => {
    UserInterest.belongsTo(db.User, { foreignKey: 'userId' });
  };

  return UserInterest;
};