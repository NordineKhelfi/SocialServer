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

    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "SET NULL",
      references: {
        model: "Media",
        key: "id"
      }
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },

    numFollowers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    numFollowing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    numPosts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    numVisits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },


    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },


    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true

    },
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
      type: DataTypes.STRING,
      allowNull: true
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "SET NULL",
      references: {
        model: "Countries",
        key: "id"
      }
    },
  
    mute : { 
      type : DataTypes.BOOLEAN , 
      allowNull : false , 
      defaultValue : false , 
    } , 

    allowMessaging : { 
      type : DataTypes.BOOLEAN , 
      allowNull : false , 
      defaultValue : true , 
      
    } , 
    showState : {
      type : DataTypes.BOOLEAN , 
      allowNull : false , 
      defaultValue : true , 
      
    } , 
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,


    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,

    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  });

  user.associate = (db) => {
    user.belongsTo(db.Media, {
      foreignKey: "pictureId",
      as: "profilePicture"
    })

    user.belongsTo(db.Country, {
      foreignKey: "countryId",
      as: "country"
    });

    user.hasOne(db.SocialMedia, {
      foreignKey: "userId",
      as: "socialMedia"
    });

    user.hasMany(db.ConversationMember, {
      foreignKey: "userId",
      as: "conversationMember"
    })

    user.hasMany(db.Post, {
      foreignKey: "userId",
      as: "posts"
    })

    user.hasMany(db.Like, {
      foreignKey: "userId",
      as: "likes"
    });

    user.hasMany(db.Favorite, {
      as: "favorites",
      foreignKey: "userId"
    })

    user.belongsToMany(db.Comment, {
      through: "CommentLikes",
      as: "commentLikes",
      foreignKey: "userId"
    })


    user.belongsToMany(db.Replay, {
      through: "ReplayLikes",
      as: "replayLikes",
      foreignKey: "userId"
    })

    user.hasMany(db.Follow, {
      as: "following",
      foreignKey: "userId"
    });

    user.hasMany(db.Follow, {

      as: "followers",
      foreignKey: "followingId"
    });

    user.hasMany(db.BlockedUser, {

      as: "blockedUsers",
      foreignKey: "userId"
    });
    user.hasMany(db.BlockedUser, {

      as: "blockedByUsers",
      foreignKey: "blockedUserId"
    });
    

    user.hasMany(db.Story, {
      foreignKey: "userId",
      as: "stories"
    })
    user.hasMany(db.StoryLike, {
      foreignKey: "userId",
      as: "storyLikes"
    })
    user.hasMany(db.StoryComment, {
      foreignKey: "userId",
      as: "storyComments"
    })

    user.belongsToMany(db.Story, {
      as: "storiesSeen",
      through: "StorySeen",
      foreignKey: "userId"
    });


    user.hasOne(db.NotificationsState, {
      as: "notificationsState",
      foreignKey: "userId"
    })

    user.belongsToMany(db.HashTag, {
      as: "hashtags",
      through: "UserHashTags",
      foreignKey: "userId"
    })


    user.hasMany(db.ArchivedConversation , { 
      as : "archivedConversations" , 
      foreignKey : "userId"
    })

    user.hasOne(db.RemoveRequest , { 
      as : "removeRequest" , 
      foreignKey : "userId"
    })


    user.belongsToMany(db.Post  , { 
      as : "unimportantPosts" , 
      through : "UnimportantPosts" , 
      foreignKey : "userId"
    }) ; 

  }

  return user;


}