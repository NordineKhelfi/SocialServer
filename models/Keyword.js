const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Keyword = Sequelize.define("Keyword", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Keyword.associate = (db) => {
        Keyword.belongsToMany(db.Post, {
            through: "PostKeywords",
            foreignKey: "keywordId",
            as: "posts"
        });
    };


    return Keyword;

}