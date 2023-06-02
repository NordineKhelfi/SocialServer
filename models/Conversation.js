const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Conversation = Sequelize.define("Conversation", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(["individual", "group"]),
            allowNull: false,
            defaultValue: "individual"
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        } , 


        simatId : { 
            type : DataTypes.INTEGER , 
            allowNull : true , 
            onDelete : "CASCADE" , 
            references : { 
              model : "Simats" , 
              key : "id"
            }
    
        }

    });

    Conversation.associate = (db) => {

        Conversation.hasMany(db.Message, {
            foreignKey: "conversationId",
            as: "messages"
        });



        Conversation.hasMany(db.ConversationMember, {
            foreignKey: "conversationId",
            as: "members"
        });


        Conversation.hasOne(db.Simat , { 
            foreignKey : "conversationId" , 
            as  : "simat"
        })
    }
    return Conversation;
}