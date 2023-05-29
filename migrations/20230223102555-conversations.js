'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

  

    return queryInterface.createTable("Conversations" , { 
      id : { 
        type : Sequelize.INTEGER , 
        autoIncrement : true , 
        primaryKey : true , 
        allowNull : false 
      } , 
      type : { 
        type : Sequelize.ENUM(["individual" , "group"]) ,  
        allowNull : false , 
        defaultValue  : "individual"
      } , 
      updatedAt : { 
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }


      
    })

     
  },


  async after (queryInterface , Sequelize) { 
    console.log("after") ; 
  } ,   
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Conversations") ; 
  }
};
