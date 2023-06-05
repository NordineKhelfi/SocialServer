'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Messages", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false

      },
      content: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(["text", "image", "video", "record" , "post"]),
        defaultValue: "text",
        allowNull: false
      },
      mediaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Media",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Conversations",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } , 

      postId  : { 
        type :  Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "SET NULL" , 
        references  : { 
          model : "Posts" , 
          key : "id"
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Messages");
  }
};
