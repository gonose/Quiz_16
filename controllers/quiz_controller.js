var models = require('../models');

// GET /quizzes
exports.index = function(req,res,next){
	var text = req.query.search;
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
};

// GET /quizzes:id
exports.show = function(req, res, next) {
	models.Quiz.findById(req.params.id).then(function(quiz) {
		if(quiz){
			var answer = req.query.answer || '';
			res.render('quizzes/show', { quizId: quiz.id, question: quiz.question,
									answer: answer });
		}
		else {
			throw new Error('No hay preguntas en la BBDD. ');
		}
	}).catch(function(error) { next(error);});
};

// GET /quizzes:id/check
exports.check = function(req, res, next) {
	models.Quiz.findById(req.params.id).then(function(quiz) {
		if(quiz){
			var answer = req.query.answer || "";
  			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
  			res.render('quizzes/result', { quiz: quiz, result: result,
  								answer: answer });
		}
		else {
			throw new Error('No existe ese quiz en la BBDD');
		}
	}).catch(function(error) { next(error);});
};