'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const simats = require("../assets/simats.json") ; 
    return queryInterface.bulkInsert("Simats" , simats)
     
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Simats', { }, {})

  }
};
