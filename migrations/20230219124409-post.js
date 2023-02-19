'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Posts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIcrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(["note", "image", "reel"]),
        allowNull: false,
        defaultValue: "note"
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type  :Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"
        }
      } , 
      createdAt : Sequelize.DATE , 
      updatedAt : Sequelize.DATE , 
    } , { 
      timestamps  : true 
    })
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable("Posts");
  }
};
