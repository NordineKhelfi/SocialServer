'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("ConversationMembers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Conversations",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      lastSeenAt: {
        type: Sequelize.DATE,
        allowNull: true,

      },
      allowNotifications : { 
        type : Sequelize.BOOLEAN , 
        allowNull : false , 
        defaultValue : true , 
      } , 


      isParticipant: {

        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false

      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("ConversationMembers");
  }
};
