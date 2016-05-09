var express = require('express');
var router = express.Router();
var controllers = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Autoload de rutas que usen :quizId
router.param('id', controllers.load);

// Quizzes
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Gonzalo J. Osende Pérez' });
});
router.get('/quizzes', controllers.index)
router.get('/quizzes/:id(\\d+)', controllers.show);
router.get('/quizzes/:id(\\d+)/check', controllers.check);
router.get('/quizzes/new', controllers.new);
router.post('/quizzes', controllers.create);

module.exports = router;
