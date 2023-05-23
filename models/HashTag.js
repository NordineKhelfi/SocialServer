const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const HashTag = Sequelize.define("HashTag", {
        id : { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
    
          } , 
          name : { 
            type : DataTypes.STRING , 
            allowNull : false 
          } , 
    });
    
    HashTag.associate = ( db ) => {
        HashTag.belongsToMany(db.Post , {
            through : "PostHashTags" , 
            hashtagId : "hashtagId" , 
            as : "posts"
        }); 

        HashTag.belongsToMany(db.User , { 
            as : "users" , 
            through : "UserHashTags" , 
            foreignKey : "hashtagId"
          })
    
      
    
       
    } ; 

   
    return HashTag;

}