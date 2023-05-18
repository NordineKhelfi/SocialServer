'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("PostHashTags" , {
      postId : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Posts" , 
          key : "id" 
        } , 
       
      } , 
      hashtagId : { 
        type  : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : {
          model : "HashTags" , 
          key : "id"
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("PostHashTags")
  }
};
