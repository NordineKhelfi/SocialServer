'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("ConversationMembers", {
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Conversations",
          key: "id"
        },
        onDelete: "CASCADE"
      } , 

      userId : { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
        
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("ConversationMembers") ; 
  }
};
