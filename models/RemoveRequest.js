const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const RemoveRequest = Sequelize.define("RemoveRequest", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          } , 
          reason : { 
            type  : DataTypes.STRING , 
            allowNull : true 
          } , 
    
          reasonId : { 
            type : DataTypes.INTEGER , 
            allowNull : true , 
            onDelete : "SET NULL" , 
            references : { 
              model : "RemoveReasons" , 
              key : "id"
            }
          } , 
          userId : { 
            type : DataTypes.INTEGER , 
            allowNull : false , 
            onDelete : "CASCADE" , 
            references : { 
              model : "Users" , 
              key : "id"
            }
          }

    });

    RemoveRequest.associate = (db) => {

        RemoveRequest.belongsTo(db.RemoveReason, {
            as: "removeReason",
            foreignKey: "reasonId"
        }) ; 


        RemoveRequest.belongsTo(db.User, {
            as: "user",
            foreignKey: "userId"
        })


    }
    return RemoveRequest;
}