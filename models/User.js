const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {

  const user = Sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
 
    username : { 
      type: DataTypes.STRING,
      allowNull: false , 
      unique : true 
    
    } , 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    birthday: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    
    
    bio: { 
      type : DataTypes.STRING , 
      allowNull : true 
    } , 
    private : { 
      type : DataTypes.BOOLEAN , 
      allowNull : false , 
      defaultValue : false 
    }  , 

    disabled : { 
      type : DataTypes.BOOLEAN , 
      allowNull : false , 
      defaultValue : false 
    }  , 
    

    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "SET NULL",
      references: {
        model: "Countries",
        key: "id"
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE


  }, {
    timestamps: true
  });

  user.associate = (db) => {

    user.belongsTo(db.Country, {
      foreignKey: "countryId",
      as: "country"
    }) ; 

    user.hasOne(db.SocialMedia , { 
      foreignKey: "userId",
      as: "socialMedia"
    })
    
    user.hasMany(db.Post , { 
      foreignKey: "userId",
      as: "posts"
    }) 

    user.belongsToMany(db.Post, { 
      through : "Likes" , 
      as : "likes"
    }) ; 

    user.belongsToMany(db.Post , { 
      through : "Favorites" , 
      as : "favorites" 
    })

    user.belongsToMany(db.Comment , { 
      through : "CommentLikes" , 
      as : "commentLikes" 
    })


    user.belongsToMany(db.Replay , { 
      through : "ReplayLikes" , 
      as : "replayLikes" 
    })

    user.belongsToMany(db.User , { 
      through : "FollowedUsers" , 
      as : "following" , 
      foreignKey : "userId"
    }) ; 

    user.belongsToMany(db.User , { 
      through : "FollowedUsers" , 
      as : "followers" , 
      foreignKey : "followedId"
    }) ; 

    user.belongsToMany(db.User , { 
      through : "BlockedUsers" , 
      as : "blockedUsers" ,
      foreignKey : "userId"
    }) ; 

  }

  return user;


}