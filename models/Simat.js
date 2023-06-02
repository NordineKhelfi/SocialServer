const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Simat = Sequelize.define("Simat", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          } , 
    
          path : { 
            type :  DataTypes.STRING , 
            allowNull : true  
          }

    });

    Simat.associate = (db) => {
       
        Simat.hasMany(db.Conversation , { 
            as : "conversations" , 
            foreignKey : "simatId" 
        })
       
        
    }
    return Simat;
}