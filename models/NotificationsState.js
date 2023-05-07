const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const NotificationState = Sequelize.define("NotificationsState", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
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
        sawFollowNotificationAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sawLikeNotificationAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sawCommentNotificationAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sawServiceNotificationAt: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, { 
        freezeTableName: true,
        tableName : "NotificationsState"
    })


    NotificationState.associate = (db) => {
     

        NotificationState.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        });
    };

    return NotificationState;

}