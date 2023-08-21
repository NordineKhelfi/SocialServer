'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Services" , {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      } , 

      period : {

        type : Sequelize.INTEGER , 
        allowNull : false 
      } , 


      price : {
        type  : Sequelize.INTEGER , 
        allowNull : false 
      } , 

      categoryId : { 
        type : Sequelize.INTEGER, 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references: { 
          model : "Categories" , 
          key : "id"
        } 
      } , 

      postId : { 
        type : Sequelize.INTEGER, 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references: { 
          model : "Posts" , 
          key : "id"
        } 
      } , 
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Services") ; 
  }
};
