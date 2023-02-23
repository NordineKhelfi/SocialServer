'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Messages" , { 
      id : { 
        type :  Sequelize.INETEGR , 
        autoIncrement : true , 
        primaryKey : true , 
        allowNull : false 
        
      } , 
      content : { 
        type : Sequelize.STTRING  , 
        allowNull : false, 
      } , 
      type : { 
        
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
