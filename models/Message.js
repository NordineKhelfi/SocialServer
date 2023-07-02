const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Message = Sequelize.define("Message", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        content: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM(["text", "image", "video", "record" , "post"]),
            defaultValue: "text",
            allowNull: false
        },
        mediaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Media",
                key: "id"
            },
            onDelete: "SET NULL"
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Conversations",
                key: "id"
            },
            onDelete: "CASCADE"
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
        }, 
        postId  : { 
            type :  DataTypes.INTEGER , 
            allowNull : true , 
            onDelete : "SET NULL" , 
            references  : { 
              model : "Posts" , 
              key : "id"
            }
          }
    });

    Message.associate = ( db ) => { 
        Message.belongsTo(db.User , { 
            foreignKey : "userId" , 
            as : "sender"
        }) ; 

        Message.belongsTo(db.User ,{
            foreignKey : "accountId", 
            as : "account"
        })
        Message.belongsTo(db.Conversation , { 
            foreignKey : "conversationId" , 
            as : "conversation"
        }) ; 

        Message.belongsTo(db.Media , { 
            foreignKey : "mediaId" , 
            as : "media"
        }) ; 

        Message.belongsTo(db.Post , { 
            foreignKey : "postId" , 
            as : "post"
        })
    }

    return Message ; 
}