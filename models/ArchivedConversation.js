const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const ArchivedConversation = Sequelize.define("ArchivedConversation", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Conversations",
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

    ArchivedConversation.associate = (db) => {
        ArchivedConversation.belongsTo(db.Conversation, {
            as: "conversation",
            foreignKey: "conversationId"
        });
        ArchivedConversation.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        });

    };

    return ArchivedConversation;

}