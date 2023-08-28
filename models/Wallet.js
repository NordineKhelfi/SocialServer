const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Wallet = Sequelize.define("Wallet", {
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
        funds: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue : 0 

        }

    });

    Wallet.associate = (db) => {

        Wallet.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        })


    }
    return Wallet;
}