//criptografar senha 
const bcrypt = require('bcryptjs');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('users',[{
      name: 'wellington',
      email: 'wellington@wel.com.br',
      telefone:'35342505',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash('123456', 8)
    }]);

  },

  async down () {

  }
};
