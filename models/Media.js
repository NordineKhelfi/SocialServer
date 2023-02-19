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
    });

    Media.associate = (db) => {
        Media.belongsToMany(db.Post, {
            through: db.PostMedia
        })

    }

    return Media;
}