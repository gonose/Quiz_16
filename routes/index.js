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
router.get('/quizzes.:format?', controllers.index)
router.get('/quizzes/:id(\\d+).:format?', controllers.show);
router.get('/quizzes/:id(\\d+)/check', controllers.check);
router.get('/quizzes/new', controllers.new);
router.post('/quizzes', controllers.create);
router.get('/quizzes/:id(\\d+)/edit', controllers.edit);
router.put('/quizzes/:id(\\d+)', controllers.update);
router.delete('/quizzes/:id(\\d+)', controllers.destroy);

module.exports = router;
