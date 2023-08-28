'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.createTable("Wallets" , {
      id : { 
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      }  , 

      userId :{ 
        type : Sequelize.INTEGER, 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references: { 
          model : "Users" , 
          key : "id"
        } 
      } , 
      funds : {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue : 0 
     
  
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Wallets") ; 
  }
};
