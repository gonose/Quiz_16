var models = require('../models');
var Sequelize = require('sequelize');

//GET /quizzes/:id/comments/new
exports.new = function(req, res, next){
	var comment = models.Comment.build({text: ""});

	res.render('comments/new', { comment: comment, quiz: req.quiz});
};

//POST /quizzes/:id/comments
exports.create = function(req, res ,next){
	var comment = models.Comment.build({
		text: req.body.comment.text,
		QuizId: req.quiz.id
	});

	comment.save().then(function(comment) {
		req.flash('succes', 'Comentario creado con exito.');
		res.redirect('/quizzes/' + req.quiz.id);
	})
	.catch(Sequelize.ValidationError, function(error) {
		req.flash('error', 'Error en el comentario');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		}

		res.render('comments/new', {comment: comment, quiz: req.quiz});

	})
	.catch(function(error){
		req.flash('error', 'Error al crear el comentario: ' + error.message);
		next(error);
	});
};