// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

"use strict";
const express = require('express');
const router = express.Router();


router.get('/',function(req,res){
	res.render('home', {
		user:req.user,
	});
});




module.exports = router;