'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Replays", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      replay: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      mediaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "Media",
          key: "id"
        }
      },

      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "Comments",
          key: "id"
        }
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt  : {
        type : Sequelize.DATE , 
        allowNull : false , 
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Replays");
  }
};
