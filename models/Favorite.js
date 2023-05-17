const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Favorite = Sequelize.define("Favorite", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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
    
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
    });

    Favorite.associate = (db) => {
        Favorite.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        });

        Favorite.belongsTo(db.Post, {
            as: "post",
            foreignKey: "postId"
        });
    };

    return Favorite;

}