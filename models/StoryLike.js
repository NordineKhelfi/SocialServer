const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const StoryLike = Sequelize.define("StoryLike", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        storyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Stories",
                key: "id"
            }
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });


    StoryLike.associate = (db) => {
        StoryLike.belongsTo(db.Story, {
            as: "story",
            foreignKey: "storyId"
        })
        StoryLike.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        })
    }
    return StoryLike;
}