'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.createTable('comments',{
        id: {
          type: Sequelize.UUID,
          defaultValue:Sequelize.UUIDV4,
          primaryKey:true
        },
        comment: {
          type: Sequelize.STRING,
          allowNull:false
        },
        isActive:{
          type:Sequelize.BOOLEAN,
          defaultValue: true
        }
      });
    
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('comments');
  }
};
