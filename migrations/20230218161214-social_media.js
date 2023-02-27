'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.createTable("SocialMedia", {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id"
        }
      },

      facebook: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      twitter: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      snapshot: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      instagram: {
        type: Sequelize.STRING,
        allowNull: true,

      },

    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("SocialMedia");
  }
};
