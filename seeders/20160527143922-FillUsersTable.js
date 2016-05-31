'use strict';

var crypto = require('crypto');

function encryptPassword(password, salt){
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};


module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      { username: 'gonose',
        password: encryptPassword('4321', 'zzzz'),
        salt:'zzzz',
        isAdmin: true,
        createdAt: new Date(), updatedAt: new Date()
      },
      { username: 'pepe',
        password: encryptPassword('1234', 'aaaa'),
        salt:'aaaa',
        createdAt: new Date(), updatedAt: new Date() 
      },
    ])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
