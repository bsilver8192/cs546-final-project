/*
	This basically has the task of doing any init work that needs to be done, and what not.

 */
const mongoConnection = require('./mongoConnection');

mongoConnection.then(db=>{
	db.createCollection("user", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
	db.createCollection("documents", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
});
