const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

    const Story = Sequelize.define("Story", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        mediaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Media",
                key: "id"
            },
            onDelete: "CASCADE"
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            },
            onDelete: "CASCADE"
        },

        createdAt: DataTypes.DATE,
        expiredAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE

    }, {
        timestamps: true
    }) ; 

    Story.associate = ( db ) => { 
        Story.belongsTo(db.User , { 
            foreignKey : "userId" , 
            as : "user" 
        }) ; 
        Story.belongsTo(db.Media , { 
            foreignKey : "mediaId" , 
            as : "media" 
        }) ; 
        Story.belongsToMany(db.User , { 
            through : "StoryLikes" , 
            as : "likes" 
        }) ; 

        Story.hasMany(db.StoryComment , { 
            as : "storyComments" , 
            foreignKey : "sotyrId"
        })
    } ; 


    return Story ; 

}