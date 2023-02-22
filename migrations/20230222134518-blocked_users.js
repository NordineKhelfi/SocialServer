'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("BlockedUsers", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id"
        }
      },
      blockedUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id"
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("BlockedUsers") ; 
  }
};
