'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Reports" , { 
      id : { 
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      } , 
      reporterId : { 
        type  : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"  
        }
      } , 
      reasonId : { 
        type  : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete : "CASCADE" , 
        references : { 
          model : "ReportReasons" , 
          key : "id"  
        }
      }, 

      details : { 
        type : Sequelize.STRING , 
        allowNull : false ,
      } , 


      userId : { 
        type  : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"  
        }
      } , 

      postId : { 
        type  : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Posts" , 
          key : "id"  
        }
      } , 
      conversationId : { 
        type  : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Conversations" , 
          key : "id"  
        }
      } , 

      createdAt : {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("Reports")  ; 
  }
};
