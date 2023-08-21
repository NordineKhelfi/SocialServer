'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Works", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      } , 

      date : {
        type : Sequelize.DATE , 
        allowNull : false , 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } , 


      description : {
        type : Sequelize.TEXT , 
        allowNull : true , 

      } , 
      link : {
        type : Sequelize.STRING , 
        allowNull : true , 
      } , 
      views : {
        type : Sequelize.INTEGER, 
        allowNull : false , 
        defaultValue : 0 
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

      
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Works")
  }
};
