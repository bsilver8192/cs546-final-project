// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

"use strict";

const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const uuid = require('uuid');
const LocalStrategy = require('passport-local').Strategy;

const userPromise = require('./mongoCollections').user;

const router = express.Router();

async function doLocalCallback(req, username, password) {
	const userCollection = await userPromise;
	const user = await userCollection.findOne({username: username});
	if (user == null) {
		return [null, false, {message: 'Unrecognized username ' + username}];
	}
	const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
	if (passwordMatches) {
		return [null, user];
	} else {
		return [null, false, {message: 'Wrong password for ' + username}];
	}
}
passport.use(new LocalStrategy(
			{
				passReqToCallback: true,
			},
			function(req, username, password, done) {
				doLocalCallback(req, username, password).then((args) => {
					done.apply(this, args);
				});
			},
			));
passport.serializeUser(function(user, done) {
	return done(null, user._id);
});
async function doDeserializeUser(id) {
	const userCollection = await userPromise;
	const user = await userCollection.findOne({_id: id});
	if (user == null) { return false; }
	return user;
}
passport.deserializeUser(function(id, done) {
	doDeserializeUser(id).then((user) => { done(null, user); });
});

router.post('/login', passport.authenticate('local', {
	successReturnToOrRedirect: '/',
	failureRedirect: 'login',
	failureFlash: true,
}));
router.get('/login', function(req, res) {
	if (req.user) {
		res.render('login', {
			error:
				`You are already logged in, ${req.user.name}`,
		});
		return;
	}
	res.render('login', { error: req.flash('error') });
});
async function doCreateAccount(req, res) {
	const form = req.body;
	if (form.password != form.confirm_password) {
		req.flash('error', 'Passwords must match');
		return;
	}

	const userCollection = await userPromise;
	const existingUser = await userCollection.findOne({username: form.username});
	if (existingUser != null) {
		req.flash('error', `${form.username} is already taken, pick something else`);
		return;
	}

	let user = {
		_id: uuid(),
		name: form.name,
		username: form.username,
		hashedPassword: await bcrypt.hash(form.password, 16),
	};
	const r = await userCollection.insertOne(user);
	if (r.insertedCount != 1) {
		req.flash('error', 'Creating account failed. Please try again');
		return;
	}
	req.flash('success', `Successfully created account ${form.username}`);
}
router.post('/create', async (req, res) => {
	await doCreateAccount(req, res);
	res.redirect('create');
});
router.get('/create', function(req, res) {
	const errors = req.flash('error');
	let params = {};
	if (errors.length == 0) {
		const success = req.flash('success');
		if (success.length != 0) {
			params['success'] = success;
		} else if (req.user) {
			params['error'] =
				`You are already logged in, ${req.user.name}. Continuing will create a new account.`;
		}
	} else {
		params['error'] = errors;
	}
	res.render('create_account', params);
});

module.exports = router;
