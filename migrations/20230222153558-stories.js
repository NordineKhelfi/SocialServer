'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Stories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      mediaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Media",
          key: "id"
        } , 
        onDelete : "CASCADE" 
      },

      userId : { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        } , 
        onDelete : "CASCADE" 
      } , 

      createdAt : Sequelize.DATE  ,  
      expiredAt : Sequelize.DATE , 
      updatedAt : Sequelize.DATE 

    } , { 
      timestamps : true 
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Stories") ; 
  }
};
