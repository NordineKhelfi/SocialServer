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
    /*

    return Promise.all([
      queryInterface.addColumn('ConversationMembers', 'isParticipant', {

        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false

      }) , 


      queryInterface.addColumn('Conversations', 'simatId', {

        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Simats" , 
          key : "id"
        }

      })
    ]);
    */
  },

  async down(queryInterface, Sequelize) {
    /*
    return Promise.all([
      queryInterface.removeColumn('ConversationMembers', 'isParticipant') , 
      queryInterface.removeColumn('Conversations', 'simatId') , 
      
    ])
      */

    
    
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    
  }
};
