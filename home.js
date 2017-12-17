
"use strict";
const express = require('express');
const router = express.Router();


router.get('/',function(req,res){
	let msg = "";
	if(req.user){
		msg = "Welcome, " + req.user.name;
		
	}else{
		msg = "Welcome, guest"
	}
	res.render('home',{user:msg});
	
});




module.exports = router;