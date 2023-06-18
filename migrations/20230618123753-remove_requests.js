'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("RemoveRequests", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      } , 
      reason : { 
        type  : Sequelize.STRING , 
        allowNull : true 
      } , 

      reasonId : { 
        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "SET NULL" , 
        references : { 
          model : "RemoveReasons" , 
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
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("RemoveRequests") ; 
  }
};
