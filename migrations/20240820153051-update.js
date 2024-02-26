'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    /*
    return Promise.all([
      queryInterface.addColumn("Users" , "categoryId" , {
        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete: "SET NULL",
        references: {
          model: "Categories",
          key: "id"
        }
      }) ,
      queryInterface.addColumn("Users" , "professional" , {
        type : Sequelize.BOOLEAN , 
        allowNull : false ,
        defaultValue : false 
      }) ,
    ])
    */

    /*
    return Promise.all([
      queryInterface.changeColumn("Posts" , "type" , {
        type: Sequelize.ENUM(["note", "image", "reel" , "work" , "service"]),
        allowNull: false,
        defaultValue: "note"
      })
    ])
    */


    /*
    return Promise.all([
      queryInterface.addColumn("Services", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    ])
    */

    return Promise.all([

    
      queryInterface.addColumn("HashTags" , "name" , {
         
          type: Sequelize.STRING,
          allowNull: false , 
 
          
      })
    ])
  },

  async down(queryInterface, Sequelize) {

    //return       queryInterface.removeColumn('Countries', 'dialCode') 

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
