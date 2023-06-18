const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const RemoveReason = Sequelize.define("RemoveReason", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        reason: {
            type: DataTypes.STRING,
            allowNull: true
        }

    });

    RemoveReason.associate = (db) => {

        RemoveReason.hasMany(db.RemoveRequest, {
            as: "removeRequests",
            foreignKey: "reasonId"
        })


    }
    return RemoveReason;
}