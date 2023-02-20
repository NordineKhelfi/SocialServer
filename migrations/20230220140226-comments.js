'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Comments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      } , 

      comment : { 
        type  :Sequelize.STRING , 
        allowNull : true , 
      } , 


      mediaId : { 
        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "SET NULL" , 
        references : { 
          model : "Media" , 
          key : "id"
        }  
      } , 
      
      postId : { 
        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Posts" , 
          key : "id"
        }  
      } , 

    
      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : true , 
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"
        }  
      } , 

      createdAt : Sequelize.DATE , 
      updatedAt : Sequelize.DATE  
    } , { 
      timestamps : true 
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Comments") ; 
  }
};
