const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Media = Sequelize.define("Media", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    } , { 
        name  :  { 
            singular: 'media',
            plural: 'media',
        }
    });

    Media.associate = (db) => {
        Media.belongsToMany(db.Post, {
            through: "PostMedia" , 
            as : "posts" , 
            foreignKey : "mediaId" 
        }) ; 

        Media.hasOne(db.Story , {
            as : "story" , 
            foreignKey : "mediaId"
        })

        Media.hasOne (db.Reel , {
            as : "reel" , 
            foreignKey : "thumbnailId"
        }) ; 

        Media.hasOne(db.Comment , { 
            as : "comment" , 
            foreignKey : "mediaId"
        }) ; 

        Media.hasOne(db.Replay , { 
            as : "replay" , 
            foreignKey : "mediaId"
        }) ; 
        Media.hasOne(db.Message , { 
            as : "message" , 
            foreignKey : "mediaId"
        })
    }

    return Media;
}