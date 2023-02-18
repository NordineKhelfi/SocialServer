const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize , DataTypes) => { 
    const SocialMedia = Sequelize.define("SocialMedia" , { 
        userId : { 
            type : DataTypes.INTEGER , 
            allowNull : false , 
            references : { 
              model : "Users" , 
              key : "id"
            }
          } , 
  
          facebook : { 
            type : DataTypes.STRING , 
            allowNull : true , 
  
          } , 
  
          twitter : { 
            type : DataTypes.STRING , 
            allowNull : true , 
  
          } , 
  
          snapshot : { 
            type : DataTypes.STRING , 
            allowNull : true , 
  
          } , 
  
          instagram : { 
            type : DataTypes.STRING , 
            allowNull : true , 
  
          } , 
    }) ; 

    SocialMedia.removeAttribute("id") ; 

    SocialMedia.associate = (db) => { 
        SocialMedia.belongsTo(db.User ,  { 
            foreignKey : "userId" , 
            as : "user"
        })
    } ; 


    return SocialMedia 
}