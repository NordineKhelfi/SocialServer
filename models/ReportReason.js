const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const ReportReason = Sequelize.define("ReportReason", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    ReportReason.associate = (db) => {
        ReportReason.hasMany(db.Report , { 
            as : "reports" , 
            foreignKey : "reasonId"
        })  
    }

    return ReportReason;
}