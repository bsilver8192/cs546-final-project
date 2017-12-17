// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

"use strict";

const uuid = require('uuid');
const express = require('express');

const documentPromise = require('./mongoCollections').document;
const userPromise = require('./mongoCollections').user;

const router = express.Router();

async function doCreateDocument(req, res) {
	const documentCollection = await documentPromise;

	const document = req.body;
	if (document.url == '') {
		req.flash('error', 'Need a URL');
		return null;
	}
	if (document.models == '') {
		req.flash('error', 'Need at least one model number');
		return null;
	}
	if (document.manufacturer == '') {
		req.flash('error', 'Need a manufacturer');
		return null;
	}
	if (document.type == null) {
		req.flash('error', 'Must select a type');
		return null;
	}

	const id = uuid();
	const newDocument = {
		_id: id,
		url: document.url,
		model_numbers: document.models.split(' '),
		manufacturer: document.manufacturer,
		documentType: document.type,
		uploader: req.user._id,
	};
	const r = await documentCollection.insertOne(newDocument);
	if (r.insertedCount != 1) {
		req.flash('error', 'Unknown error');
		return null;
	}
	return id;
}

function checkLoggedIn(req, res) {
	if (!req.user) {
		req.flash('error', 'You must log in to create a document');
		req.session.returnTo = '/document/create';
		res.redirect('/account/login');
		return false;
	}
	return true;
}

router.post('/create', async (req, res) => {
	if (!checkLoggedIn(req, res)) return;

	const id = await doCreateDocument(req, res);
	if (id != null) {
		res.redirect('view/' + id);
		return;
	}
	res.redirect('create');
});
router.get('/create', function(req, res) {
	if (!checkLoggedIn(req, res)) return;

	res.render('create_document', {
		error: req.flash('error'),
		user: req.user,
	});
});

router.get('/view/:id', async (req, res) => {
	const documentCollection = await documentPromise;
	const userCollection = await userPromise;

	const document = await documentCollection.findOne({_id: req.params.id});
	if (document == null) {
		res.status(404).send(`Document ${req.params.id} not found`);
		return;
	}

	// Don't care if this is null. The template handles it.
	const uploader = await userCollection.findOne({_id: document.uploader});

	let classes;
	if (req.user && req.user.favorites.indexOf(document._id) != -1) {
		classes = 'favorite selected';
	} else {
		classes = 'favorite';
	}

	res.render('view_document', {
		document: document,
		uploader: uploader,
		user: req.user,
		classes: classes,
	});
});

module.exports = router;
