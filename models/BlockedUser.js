const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const BlockedUser = Sequelize.define("BlockedUser", {
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
        blockedUserId: {
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

    BlockedUser.associate = (db) => {
        BlockedUser.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        });

        BlockedUser.belongsTo(db.User, {
            as: "blocking",
            foreignKey: "blockedUserId"
        });
    };

    return BlockedUser;

}