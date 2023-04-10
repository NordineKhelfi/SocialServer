'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    return queryInterface.createTable("StorySeen" , {
      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : {
          model : "Users" , 
          key : "id"
        } , 


      } , 
      storyId : { 
        type : Sequelize.INTEGER , 
        allowNll : false , 
        onDelete : "CASCADE"  ,
        references : {
          model : "Stories" , 
          key : "id" 
        }
      }
    }) ; 

  },

  async down (queryInterface, Sequelize) {
    

    return queryInterface.dropTable("StorySeen") ; 
  }
};
