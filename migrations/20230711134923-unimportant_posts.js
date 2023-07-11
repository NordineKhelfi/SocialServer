'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("UnimportantPosts", {

      postId: {
        type : Sequelize.INTEGER , 
        allowNull : false  ,
        onDelete : "CASCADE" , 
        references : { 
          model : "Posts" , 
          key : "id"
        }
      },
      userId: {
        type : Sequelize.INTEGER , 
        allowNull : false  ,
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("UnimportantPosts");
  }
};
