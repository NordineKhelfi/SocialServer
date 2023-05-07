'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("NotificationsState", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model : "Users" , 
          key : "id"
        }
      } , 
      sawFollowNotificationAt : { 
        type : Sequelize.STRING , 
        allowNull : true , 
      } , 
      sawLikeNotificationAt : { 
        type : Sequelize.STRING , 
        allowNull : true , 
      }, 
      sawCommentNotificationAt : { 
        type : Sequelize.STRING , 
        allowNull : true , 
      }, 
      sawServiceNotificationAt : { 
        type : Sequelize.STRING , 
        allowNull : true , 
      }
    })

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("NotificationsState")
  }
};
