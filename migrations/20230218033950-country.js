'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("Countries", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false } , 

      dialCode : {
        type : Sequelize.STRING  , 
        allowNull : false , 
      },
      createdAt : Sequelize.DATE , 
      updatedAt : Sequelize.DATE 
    }, {
      timestamps: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    })
    
    /*
    .then(async () => {

      const countries = require("../assets/countries.json");
      await queryInterface.bulkInsert("Countries", countries.map((country) => {
        return {
          name: country.name , 
          dialCode : country.dialCode 
        }
      }))
    });
    */
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Countries");
  }
};
