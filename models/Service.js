const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const Service = Sequelize.define("Service", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        period: {

            type: DataTypes.INTEGER,
            allowNull: false
        },


        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Categories",
                key: "id"
            }
        },

        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Posts",
                key: "id"
            }
        },
    });

    Service.associate = (db) => {
        Service.belongsTo(db.Category, {
            foreignKey: "categoryId",
            as: "category"
        });

        Service.belongsTo(db.Post, {
            foreignKey: "postId",
            as: "post"
        })
    }

    return Service;

}