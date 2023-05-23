'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("UserHashTags" , {
      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model  : "Users" , 
          key : "id"
        } , 
      } ,
      hashtagId : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model  : "HashTags" , 
          key : "id"
        } , 
      } ,
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("UserHashTags") ; 
  }
};
