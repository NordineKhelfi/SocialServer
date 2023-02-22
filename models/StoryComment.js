const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const StoryComment = Sequelize.define("StoryComment", {
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
        comment: {
            type: DataTypes.STRING,
            allowNull: false,

        }
    }); 
    StoryComment.associate = ( db ) => { 
        StoryComment.belongsTo(db.Story , { 
            as : "story" , 
            foreignKey : "storyId"
        });
        StoryComment.belongsTo(db.User , { 
            as : "user" , 
            foreignKey : "userId"
        }); 
    } ; 


    return StoryComment ; 
}