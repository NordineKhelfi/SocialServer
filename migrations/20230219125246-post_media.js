'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("PostMedia", {
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
          model: "Media",
          key: "id"
        }
      }

    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("PostMedia");
  }
};
