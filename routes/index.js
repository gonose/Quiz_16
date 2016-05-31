var express = require('express');
var router = express.Router();
var quizcontrollers = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var usercontroller = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Autoload de rutas que usen :quizId
router.param('id', quizcontrollers.load);
router.param('userId', usercontroller.load);

// Quizzes
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Gonzalo J. Osende Pérez' });
});
router.get('/quizzes.:format?', quizcontrollers.index);
router.get('/quizzes/:id(\\d+).:format?', quizcontrollers.show);
router.get('/quizzes/:id(\\d+)/check', quizcontrollers.check);
router.get('/quizzes/new', quizcontrollers.new);
router.post('/quizzes', quizcontrollers.create);
router.get('/quizzes/:id(\\d+)/edit', quizcontrollers.edit);
router.put('/quizzes/:id(\\d+)', quizcontrollers.update);
router.delete('/quizzes/:id(\\d+)', quizcontrollers.destroy);

// Comments
router.get('/quizzes/:id(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:id(\\d+)/comments', commentController.create)

// Users
router.get('/users', 						usercontroller.index);
router.get('/users/:userId(\\d+)',			usercontroller.show);
router.get('/users/new',					usercontroller.new);
router.post('/users',						usercontroller.create);
router.get('/users/:userId(\\d+)/edit',		usercontroller.edit);
router.put('/users/:userId(\\d+)',			usercontroller.update);
router.delete('/users/:userId(\\d+)',		usercontroller.destroy);

module.exports = router;
