'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("PostMedias", {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Posts",
          key: "id"
        }

      },

      mediaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Medias",
          key: "id"
        }
      }

    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("PostMedia");
  }
};
