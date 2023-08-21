const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const Work = Sequelize.define("Work", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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

    Work.associate = ( db ) => {
        Work.belongsTo(db.Category , {
            foreignKey : "categoryId" , 
            as : "category"
        }) ; 
    
        Work.belongsTo(db.Post , {
            foreignKey : "postId"  , 
            as : "post"
        })
    }
   
    return Work;

}