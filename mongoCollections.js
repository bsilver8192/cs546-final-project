// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project
//
// A module to separate the concern of database connection [sic] into its own
// module. Pretty trivial, but it seems like this is expected.

"use strict";

const mongoConnection = require('./mongoConnection');

// Promises which will resolve to each of the relevant collections.
module.exports = {
	user: mongoConnection.then(connection => connection.collection('user')),
	document: mongoConnection.then(connection =>
			connection.collection('document')),
};
