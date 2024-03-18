const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

  const UserPostInteraction = Sequelize.define("UserPostInteraction", {
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Posts",
        key: "id"
      }
    },
    interactionType: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  UserPostInteraction.associate = db => {
    UserPostInteraction.belongsTo(db.User, { foreignKey: 'userId' });
    UserPostInteraction.belongsTo(db.Post, { foreignKey: 'postId' });
  }

  return UserPostInteraction;
}