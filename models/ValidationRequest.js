const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const ValidationRequest = Sequelize.define("ValidationRequest", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
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
        fileType: {
            type: DataTypes.ENUM(['بطاقة تعريف', 'جواز سفر']),
            allowNull: false,
            defaultValue: "بطاقة تعريف"
        },
        mediaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Media",
                key: "id"
            }
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Countries",
                key: "id"
            }
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
        validated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        linkOne: {
            type: DataTypes.STRING,
            allowNull: false
        },
        linkTwo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });


    ValidationRequest.associate = ( db ) => { 
        ValidationRequest.belongsTo(db.User , { 
            foreignKey : "userId" , 
            as : "user"
        }); 

        ValidationRequest.belongsTo(db.Media , { 
            foreignKey : "mediaId" , 
            as : "media"
        }); 

        ValidationRequest.belongsTo(db.Country , { 
            foreignKey : "countryId" , 
            as : "country"
        }); 

        ValidationRequest.belongsTo(db.Category , { 
            foreignKey : "categoryId" , 
            as : "category"
        }); 
        
    }


    return ValidationRequest;
}