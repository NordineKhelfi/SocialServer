const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const PostMedia = Sequelize.define("PostMedia", {
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Posts",
                key: "id"
            }
        },

        mediaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "Medias",
                key: "id"
            }
        }
    }) ; 

    return PostMedia ; 

}