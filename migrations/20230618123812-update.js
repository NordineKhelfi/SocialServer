'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
    return Promise.all([
      queryInterface.changeColumn("Messages", "type",{
        type: Sequelize.ENUM(["text", "image", "video", "record" , "post"]),
        defaultValue: "text",
        allowNull: false
      }) , 
      queryInterface.addColumn("Messages" , "postId" , {
        type :  Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "SET NULL" , 
        references  : { 
          model : "Posts" , 
          key : "id"
        }
      })
    ])
    */
    /*
    return Promise.all([
      queryInterface.addColumn("Messages", "accountId",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          onDelete: "CASCADE",
          references: {
            model: "Users",
            key: "id"
          }
        }
      ) , 
      queryInterface.changeColumn("Messages", "type",{
        type: Sequelize.ENUM(["text", "image", "video", "record" , "post", "account"]),
        defaultValue: "text",
        allowNull: false
      })
    ])
  */
  },

  async down(queryInterface, Sequelize) {
    /*
    return Promise.all([
      queryInterface.removeColumn('ConversationMembers', 'isParticipant') , 
      queryInterface.removeColumn('Conversations', 'simatId') , 
      
    ])
    */



    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

  }
};
