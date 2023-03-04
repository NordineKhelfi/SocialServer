const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize , DataTypes) => { 
    const Reel = Sequelize.define("Reel" , { 
        id : { 
            type : DataTypes.INTEGER , 
            autoIncrement : true , 
            primaryKey : true , 
            allowNull : false 
          } , 
          thumbnailId : { 
            type : DataTypes.INTEGER , 
            allowNull : false, 
            onDelete : "CASCADE" , 
            references : { 
              model : "Media" , 
              key : "id"
            }
          } , 
          postId : { 
            type : DataTypes.INTEGER , 
            allowNull : false, 
            onDelete : "CASCADE" , 
            references : { 
              model : "Posts" , 
              key : "id"
            }
          } , 
          views : { 
            type : DataTypes.INTEGER , 
            allowNull : false , 
            defaultValue : 0 
          } 
    })  ; 


    Reel.associate = (db) => { 
        Reel.belongsTo(db.Post , { 
            foreignKey : "postId" , 
            as : "post"
        }) ; 
        Reel.belongsTo(db.Media , { 
            foreignKey : "thumbnailId" , 
            as : "thumbnail"
        }) ; 
    }
    return Reel ; 
}