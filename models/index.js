
var path = require('path');

var Sequelize = require('sequelize');

var url, storage;

if (!process.env.DATABASE_URL) {
	url = "sqlite:///";
	storage = "quiz.sqlite";
} else{
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,
				{ storage: storage, omitNull: true});

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));
var User = sequelize.import(path.join(__dirname, 'user'));
var Attachment = sequelize.import(path.join(__dirname, 'attachment'));

// Relación entre Comment y Quiz
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación entre User y Quiz
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'})

// Relaciń entre Quiz y Attachment
Attachment.belongsTo(Quiz);
Quiz.hasOne(Attachment);

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;
exports.Attachment = Attachment;
