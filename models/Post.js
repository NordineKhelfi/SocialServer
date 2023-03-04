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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Users",
                key: "id"
            }
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci"
    });


    Post.associate = (db) => {
        Post.belongsTo(db.User, {
            foreignKey: "userId",
            as: "user"
        });

        Post.belongsToMany(db.Media, {
            through: "PostMedia",
            as: "media"
        });

        Post.hasMany(db.Comment, {
            foreignKey: "postId",
            as: "comments"
        }); 
        Post.hasOne(db.Reel , { 
            foreignKey: "postId",
            as: "reel"
        })
    }


    return Post;

}