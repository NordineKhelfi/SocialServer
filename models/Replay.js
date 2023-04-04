const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const Replay = Sequelize.define("Replay", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        replay: {
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
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            onDelete: "CASCADE",
            references: {
                model: "Comments",
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
        } , 
        createdAt  : {
            type : DataTypes.DATE , 
            allowNull : false , 
            defaultValue : Sequelize.literal('CURRENT_TIMESTAMP') 
          }
    });


    Replay.associate = (db) => {
        Replay.belongsTo(db.Media, {
            foreignKey: "mediaId",
            as: "media"
        });

        Replay.belongsTo(db.User, {
            foreignKey: "userId",
            as: "user"
        });

        Replay.belongsTo(db.Comment, {
            foreignKey: "commentId",
            as: "comment"
        });

        Replay.belongsToMany(db.User ,  { 
            through : "ReplayLikes" , 
            as : "userLikes"
        })
    } ; 

    return Replay ; 
}