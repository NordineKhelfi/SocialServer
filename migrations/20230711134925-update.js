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
      queryInterface.addColumn("Users", "mute",
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }
      ),

      queryInterface.addColumn("Users", "allowMessaging",
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        }
      ),
      queryInterface.addColumn("Users", "showState",
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        }
      ),
      queryInterface.addColumn("ConversationMembers", "allowNotifications",
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }
      ),
    ])
    */
    /*
    return queryInterface.addColumn("Countries", "dialCode",
      {
        type: Sequelize.STRING,
        allowNull: true ,
      }
    ) ; 
      */
    
    
  },

  async down(queryInterface, Sequelize) {

    //return       queryInterface.removeColumn('Countries', 'dialCode') 

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
