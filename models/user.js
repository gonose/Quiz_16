var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User',
		{ username: {
			type: DataTypes.STRING,
			unique: true,
			validate: { notEmpty: {msg: "Falta username"}}
		  },
		  password: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "Falta password"}},
			set: function(password) {
				this.salt = Math.round((new Date().valueof() * Math.random())) + '';
				this.setDataValue('password', encryptPassword(password, this.salt));
			}
		  },
		  salt: {
		  	type: DataTypes.STRING
		  },
		  isAdmin: {
		  	type: DataTypes.BOOLEAN,
		  	defaultValue: false
		  }
	});
};

function encryptPassword(password, salt){
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}