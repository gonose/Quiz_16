var express = require('express');
var router = express.Router();
var controllers = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* GET author page. */
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Gonzalo J. Osende Pérez' });
});

/* GET questions page. */
router.get('/quizzes', controllers.question);

/* GET results page. */
router.get('/check', controllers.check);

module.exports = router;
