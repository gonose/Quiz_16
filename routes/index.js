var express = require('express');
var router = express.Router();

var quizcontrollers = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var usercontroller = require('../controllers/user_controller');
var sessioncontroller = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Autoload de rutas que usen :quizId
router.param('id', quizcontrollers.load);
router.param('userId', usercontroller.load);
router.param('commentId', commentController.load);

// Quizzes
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Gonzalo J. Osende Pérez' });
});
router.get('/quizzes.:format?', 			quizcontrollers.index);
router.get('/quizzes/:id(\\d+).:format?', 	quizcontrollers.show);
router.get('/quizzes/:id(\\d+)/check', 		quizcontrollers.check);
router.get('/quizzes/new', 					sessioncontroller.loginRequired, 
											quizcontrollers.new);
router.post('/quizzes', 					sessioncontroller.loginRequired, 
											quizcontrollers.create);
router.get('/quizzes/:id(\\d+)/edit', 		sessioncontroller.loginRequired, 
											quizcontrollers.ownershipRequired,
											quizcontrollers.edit);
router.put('/quizzes/:id(\\d+)', 			sessioncontroller.loginRequired, 
											quizcontrollers.ownershipRequired, 
											quizcontrollers.update);
router.delete('/quizzes/:id(\\d+)', 		sessioncontroller.loginRequired, 
											quizcontrollers.ownershipRequired,
											quizcontrollers.destroy);

// Comments
router.get('/quizzes/:id(\\d+)/comments/new', 	sessioncontroller.loginRequired,
												commentController.new);
router.post('/quizzes/:id(\\d+)/comments', 		sessioncontroller.loginRequired,
												commentController.create)
router.put('/quizzes/:id(\\d+)/comments/:commentId(\\d+)/accept',
												sessioncontroller.loginRequired,
												quizcontrollers.ownershipRequired, 
												commentController.accept);
// Users
router.get('/users', 						usercontroller.index);
router.get('/users/:userId(\\d+)',			usercontroller.show);
router.get('/users/new',					usercontroller.new);
router.post('/users',						usercontroller.create);
router.get('/users/:userId(\\d+)/edit',		sessioncontroller.loginRequired, 
											usercontroller.adminOrMyselfRequired,
											usercontroller.edit);
router.put('/users/:userId(\\d+)',			sessioncontroller.loginRequired, 
											usercontroller.adminOrMyselfRequired,
											usercontroller.update);
router.delete('/users/:userId(\\d+)',		sessioncontroller.loginRequired, 
											usercontroller.adminAndNotMyselfRequired,
											usercontroller.destroy);

// Session
router.get('/session', sessioncontroller.new);
router.post('/session', sessioncontroller.create);
router.delete('/session', sessioncontroller.destroy);

router.get('/quizzes/:id(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:id(\\d+)/comments', commentController.create)

module.exports = router;
