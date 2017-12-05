// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// A module to separate the concern of database connection [sic] into its own
// module. Pretty trivial, but it seems like this is expected.

"use strict";

const MongoClient = require('mongodb').MongoClient;

const databaseUrl = 'mongodb://localhost:27017/final-project';

// A promise which will resolve to a database connection.
module.exports = MongoClient.connect(databaseUrl);
