const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

  const PostTag = Sequelize.define("PostTag", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    tag: DataTypes.STRING,
  });

  PostTag.associate = db => {
    PostTag.belongsTo(db.Post, { foreignKey: 'postId' });
  }

  return PostTag;
}