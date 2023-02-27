'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.createTable("Media" , { 
      id : { 
        type: Sequelize.INTEGER , 
        allowNull : false, 
        autoIncrement : true , 
        primaryKey : true
      } , 
      path : { 
        type : Sequelize.STRING , 
        allowNull : false 
      } 
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Media") ; 

  }
};
