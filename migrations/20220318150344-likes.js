"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_likes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      postId: {
        type:Sequelize.UUID,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('likes');
  },
};
