'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Reels" , { 
      id : { 
        type : Sequelize.INTEGER , 
        autoIncrement : true , 
        primaryKey : true , 
        allowNull : false 
      } , 
      thumbnailId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Media" , 
          key : "id"
        }
      } , 
      postId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Posts" , 
          key : "id"
        }
      } , 
      views : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        defaultValue : 0 
      } 
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Reels") 
  }
};
