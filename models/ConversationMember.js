const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Member = Sequelize.define("ConversationMember", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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
            references: {
                model: "Users",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        lastSeenAt: {
            type: DataTypes.DATE,
            allowNull: true,

        },

        allowNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        isParticipant: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Member.associate = (db) => {
        Member.belongsTo(db.Conversation, {
            as: "conversation",
            foreignKey: "conversationId"
        });

        Member.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        });
    };

    return Member;

}