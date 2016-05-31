var models = require('../models');
var Sequelize = require('sequelize');
var url =require('url');

var authenticate = function(login, password) {
	return models.User.findOne({where: {username: login}})
		.then(function(user){
			if(user && user.verifyPassword(password)) {
				return user;
			} else {
				return null;
			}
		});
};

// GET /session 
exports.new = function(req, res, next) {
	var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
	if(redir === '/session' || redir === '/users/new') { redir = "/"; }
	res.render('session/new', { redir: redir});
};

// POST /session
exports.create = function(req, res, next) {
	var redir = req.body.redir || '/';
	var login = req.body.login;
	var password = req.body.password;

	authenticate(login, password)
		.then(function(user){
			if(user){
				req.session.user = {id: user.id, username: user.username, isAdmin: user.isAdmin};
				res.redirect(redir);
			} else {
				req.flash('error', 'La autenticación ha fallado. Reintentelo de nuevo.');
				res.redirect('/session?redir='+redir);
			}
		})
		.catch(function(error){
			req.flash('error', 'Se ha producido un error: '+error);
			next(error);
		});
};

// DELETE /session 
exports.destroy = function(req, res, next) {
	delete req.session.user;
	res.redirect('/session');
};

exports.loginRequired = function(req, res, next) {
	if(req.session.user) {
		next();
	} else {
		res.redirect('/session?redir=' + (req.param('redir') || req.url));
	}
};