const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes, db) => {
    const country = Sequelize.define("Country", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        dialCode: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tablename: "Countries"
    });


    country.associate = (db) => {
        country.hasMany(db.User, {
            foreignKey: "countryId",
            as: "users"
        })
    }
    return country;


}
