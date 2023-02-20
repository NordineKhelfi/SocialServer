'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("CommentLikes" , { 
      commentId : { 
        type : Sequelize.INTEGER , 
        allowNull : false ,
        onDelete : "CASCADE" , 
        references : { 
          model : "Comments" , 
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
    }) ; 
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("CommentLikes") ; 
  }
};
