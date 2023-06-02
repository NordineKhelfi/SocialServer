'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.createTable("ArchivedConversations" ,  { 
      conversationId : { 
        type : Sequelize.INTEGER , 
        allowNull : false ,
        onDelete : "CASCADE" , 
        references : { 
          model : "Conversations" , 
          key : "id"
        }
      } , 


      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : false ,
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"
        }
      } , 
      createdAt : { 
        type : Sequelize.DATE, 
        allowNull : false , 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }) ; 
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("ArchivedConversations") ; 
  }
};
