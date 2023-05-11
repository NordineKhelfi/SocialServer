const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const Comment = Sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mediaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            onDelete: "SET NULL",
            references: {
                model: "Media",
                key: "id"
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            onDelete: "CASCADE",
            references: {
                model: "Posts",
                key: "id"
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            onDelete: "CASCADE",
            references: {
                model: "Users",
                key: "id"
            }
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        timestamps: true
    });


    Comment.associate = (db) => {
        Comment.belongsTo(db.Media, {
            foreignKey: "mediaId",
            as: "media"
        });

        Comment.belongsTo(db.User, {
            foreignKey: "userId",
            as: "user"
        });

        Comment.belongsTo(db.Post, {
            foreignKey: "postId",
            as: "post"
        });
        Comment.hasMany(db.Replay , { 
            foreignKey : "commentId" , 
            as : "replays"
        })
        Comment.belongsToMany(db.User , { 
            through : "CommentLikes" , 
            as : "userLikes" , 
            foreignKey : "commentId" 

        })
    } ; 

    return Comment ; 
}