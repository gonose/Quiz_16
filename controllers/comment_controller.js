var models = require('../models');
var Sequelize = require('sequelize');

//Autoload
exports.load = function(req, res, next, commentId) {
	models.Comment.findById(commentId)
		.then(function(comment){
			if(comment) {
				req.comment = comment;
				next();
			} else {
				next(new Error('No existe commentId='+commentId));
			}
		})
		.catch(function(error) { next(error); });
}

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
		req.flash('success', 'Comentario creado con exito.');
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

// GET /quizzes/:id/comments/:commentId/accept
exports.accept = function(req, res, next){
	req.comment.accepted = true;
	req.comment.save(["accepted"])
		.then(function(comment) {
			req.flash('succes', 'Comentario aceptado con éxito.');
			res.redirect('/quizzes/'+req.params.id);
		})
		.catch(function(error) {
			req.flash('error','Error al aceptar un comentario: '+error.message);
			next(error);
		});
};