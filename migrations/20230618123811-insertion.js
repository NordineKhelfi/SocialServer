'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const simats = require("../assets/simats.json") ; 
    const reasons = require("../assets/removeReasons.json") ; 

    return Promise.all([
      queryInterface.bulkInsert("Simats" , simats) , 
      queryInterface.bulkInsert("RemoveReasons" , reasons)  
    ])

    
  },

  async down (queryInterface, Sequelize) {


    return Promise.all([
      queryInterface.bulkDelete('Simats', { }, {}) , 
      queryInterface.bulkDelete('RemoveReasons', { }, {}) , 
      
    ])
 

  }
};
