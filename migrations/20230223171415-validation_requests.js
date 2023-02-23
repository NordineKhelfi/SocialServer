'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("ValidationRequests", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      } , 
      name : { 
        type : Sequelize.STRING ,
        allowNull : false ,  
      } , 
      lastname : { 
        type : Sequelize.STRING ,
        allowNull : false ,   
      } , 

      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Users" , 
          key : "id"
        } 
      } , 
      fileType : { 
        type : Sequelize.ENUM(['بطاقة تعريف' , 'جواز سفر']) , 
        allowNull : false , 
        defaultValue : "بطاقة تعريف"
      } , 
      mediaId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Media" , 
          key : "id"
        }
      } , 
      countryId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Countries" , 
          key : "id"
        }
      } , 
      categoryId : { 
        type : Sequelize.INTEGER , 
        allowNull : false, 
        onDelete : "CASCADE" , 
        references : { 
          model : "Categories" , 
          key : "id"
        }
      } , 
      validated : { 
        type : Sequelize.BOOLEAN ,
        allowNull : false , 
        defaultValue : false  
      }, 
      linkOne : { 
        type : Sequelize.STRING , 
        allowNull : false 
      }, 
      linkTwo : { 
        type : Sequelize.STRING , 
        allowNull : true  
      } , 
      createdAt : { 
        type : Sequelize.DATE , 
        allowNull : false , 
        defaultValue : Sequelize.literal("CURRENT_TIMESTAMP") 
      }
    }, { 
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("ValidationRequests") ; 
  }
};
