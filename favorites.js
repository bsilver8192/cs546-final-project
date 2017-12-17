// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project
"use strict";

const express = require('express');
const router = express.Router();

const userPromise = require('./mongoCollections').user;
const documentPromise = require('./mongoCollections').document;

function checkLoggedIn(req, res) {
	if (!req.user) {
		req.flash('error', 'You must log in to look at favorites');
		req.session.returnTo = '/favorites/view';
		res.redirect('/account/login');
		return false;
	}
	return true;
}

router.post('/toggle/:id', async(req, res) => {
	if (!checkLoggedIn(req, res)) return;

	const user = req.user;
	const id = req.params.id;
	const index = user.favorites.indexOf(id);
	if (index == -1) {
		user.favorites.push(id);
	} else {
		user.favorites.splice(index, 1);
	}
	const users = await userPromise;
	const result = await users.updateOne({_id: user._id}, user);
	if (result.modifiedCount != 1) {
		req.flash('error', 'Unknown error');
		return;
	}
	res.sendStatus(200);
});

router.get('/view', async(req, res) => {
	if (!checkLoggedIn(req, res)) return;

	const documents = await documentPromise;
	let results = [];
	for (let i = 0; i < req.user.favorites.length; ++i) {
		const document = await documents.findOne({_id: req.user.favorites[i]});
		if (!document) continue;
		document.classes = 'favorite selected';
		results.push(document);
	}
	res.render('view_favorites', {
		results: results,
		user: req.user,
	});
});

module.exports = router;