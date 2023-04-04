const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Follow = Sequelize.define("Follow", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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
        followingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Users",
                key: "id"
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    
    Follow.associate = ( db ) => {
        Follow.belongsTo(db.User , {
            as : "user" , 
            foreignKey : "userId"
        }) ; 

        Follow.belongsTo(db.User , {
            as : "following" , 
            foreignKey : "followingId"
        }) ; 
    } ; 

  

    return Follow;

}