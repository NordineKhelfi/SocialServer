'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Categories" , {
      id : { 
        type : Sequelize.INTEGER , 
        autoIncrement : true , 
        primaryKey : true , 
        allowNull : false 
      } , 
      name : { 
        type : Sequelize.STRING , 
        allowNull : false 
      }
    }, { 
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }).then( async () => { 

      const categories = require("../assets/categories.json") ; 
      
      await queryInterface.bulkInsert("Categories" , categories ) ; 
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Categories") ; 
  }
};
