const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Post = Sequelize.define("Post", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM(["note", "image", "reel"]),
            allowNull: false,
            defaultValue: "note"
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        numComments: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
        popularity: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        timestamps: true,

        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
    });


    Post.associate = (db) => {
        Post.belongsTo(db.User, {
            foreignKey: "userId",
            as: "user"
        });


        Post.hasMany(db.Like, {
            foreignKey: "postId",
            as: "postLikes"
        })

        Post.belongsToMany(db.Media, {
            through: "PostMedia",
            as: "media",
            foreignKey: "postId"
        });


        Post.hasMany(db.Favorite, {

            as: "userFavorites",
            foreignKey: "postId"
        });

        Post.hasMany(db.Comment, {
            foreignKey: "postId",
            as: "comments"
        });
        Post.hasOne(db.Reel, {
            foreignKey: "postId",
            as: "reel"
        });

        Post.belongsToMany(db.HashTag, {
            through: "PostHashTags",
            foreignKey: "postId",
            as: "hashtags"
        });


        Post.belongsToMany(db.User, {
            as: "unimportantPosts",
            through: "UnimportantPosts",
            foreignKey: "postId"
        });
        Post.belongsToMany(db.Keyword, {
            as: "keywords",
            through: "PostKeywords",
            foreignKey: "postId"
        });


        Post.hasOne(db.Work, {
            as: "work",
            foreignKey: "postId"
        });

        Post.hasOne(db.Service, {
            as: "service",
            foreignKey: "postId"
        })
    }


    return Post;

}