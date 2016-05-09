var express = require('express');
var router = express.Router();
var controllers = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET author page. */
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Gonzalo J. Osende Pérez' });
});

router.get('/quizzes', controllers.index)

/* GET questions page. */
router.get('/quizzes/:id(\\d+)', controllers.show);

/* GET results page. */
router.get('/quizzes/:id(\\d+)/check', controllers.check);

module.exports = router;
