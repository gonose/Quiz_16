var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId, { include: [models.Comment]}).then(function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) { next(error); });
};

// GET /quizzes
exports.index = function(req,res,next){
	var text = req.query.search;
	var format = req.params.format;
	
	if( format !== "json"){
		
			if(text == undefined){
				models.Quiz.findAll().then(function(quizzes) {
					res.render('quizzes/index', { quizzes: quizzes});
				}).catch(function(error) { next(error); });
			} else {
				text = "%" + text.replace(" ", "%") + "%";
				models.Quiz.findAll({where: {question: {$like: text}}}).then(function(quizzes) {
					res.render('quizzes/index', { quizzes: quizzes});
				}).catch(function(error) { next(error); });
			}
	} else {
		models.Quiz.findAll().then(function(quizzes) {
			res.json( quizzes );
		}).catch(function(error) { next(error); });
	}	
};

// GET /quizzes:id
exports.show = function(req, res, next) {
	var format = req.params.format;

	models.Quiz.findById(req.params.id).then(function(quiz) {
		if(format === "json"){
			res.json(quiz);
		} else {
			if(quiz){
				var answer = req.query.answer || '';
				res.render('quizzes/show', { quiz: req.quiz,
											answer: answer });
			}
			else {
				throw new Error('No hay preguntas en la BBDD. ');
			}
		}

				
			
	}).catch(function(error) { next(error);});
};

// GET /quizzes:id/check
exports.check = function(req, res, next) {
	models.Quiz.findById(req.params.id).then(function(quiz) {
		if(quiz){
			var answer = req.query.answer || "";
  			var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
  			res.render('quizzes/result', { quiz: req.quiz, result: result,
  								answer: answer });
		}
		else {
			throw new Error('No existe ese quiz en la BBDD');
		}
	}).catch(function(error) { next(error);});
};

// GET /quizzes/new 
exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: "",answer: ""});
	res.render('quizzes/new', {quiz: quiz});
};

// POST /quizzes/create
exports.create = function(req, res, next) {
	var authorId = req.session.user && req.session.user.id || 0;
	var quiz = models.Quiz.build({ 	question: req.body.quiz.question,
									answer: req.body.quiz.answer,
									AuthorId: authorId} );

	quiz.save({fields: ["question", "answer", "AuthorId"]}).then(function(quiz) {
		req.flash('success', 'Quiz creado con exito.');
		res.redirect('/quizzes');
	}).catch(Sequelize.ValidationError, function(error){
		req.flash('error', 'Errores en el formulario');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		}

		res.render('quizzes/new', {quiz: quiz});
	}).catch(function(error){
		req.flash('error','Error al crear un Quiz: '+error.message);
		next(error);
	})
};

// GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
	var quiz = req.quiz;

	res.render('quizzes/edit', {quiz: quiz});
};

// PUT /quizzes/:id
exports.update = function(req, res, next) {
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]}).then(function(quiz){
		req.flash('success', "Quiz editado con éxito");
		res.redirect('/quizzes');
	})
	.catch(Sequelize.ValidationError, function(error) {
		req.flash('error', 'Errores en el formulario');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		}

		res.render('quizzes/edit', {quiz: quiz});
	}).catch(function(error){
		req.flash('error','Error al editar un Quiz: '+error.message);
		next(error);
	})
};

// DELETE /quizzes/:id
exports.destroy = function(req, res, next){
	req.quiz.destroy().then(function() {
		req.flash('success', 'Quiz borrado con éxito.');
		res.redirect('/quizzes');
	})
	.catch(function(error) {
		req.flash('error', 'Error al editar el Quiz '+ error.message);
	});
};