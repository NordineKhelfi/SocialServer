'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("PostKeywords" , {
      postId : { 
        type : Sequelize.INTEGER, 
        allowNull : false ,
        onDelete : "CASCADE" , 
        references : {
          model : "Posts" , 
          key : "id"
        } 
      } , 

      keywordId : { 
        type : Sequelize.INTEGER, 
        allowNull : false ,
        onDelete : "CASCADE" , 
        references : {
          model : "Keywords" , 
          key : "id"
        } 
      }
    })  ; 
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("PostKeywords") ; 
  }
};
