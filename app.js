// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

"use strict";

const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const account = require('./account');

const search = require('./search.js');

let app = express();
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(session({ secret: 'ebb1c616e97eb6af11d4dc788156bb1faf1f05cc', cookie: {}}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/account', account);


//Handlers for the search
app.get('/search',function(req,res){
	res.render('search',{});
});

app.post('/search',function(req,res){
	search.search(req).then((results,error)=>{
		if(error){
			req.render('search',{
				error:error
			});
		}else{
			req.render('search',{results:results});
		}
	});
});
app.listen(3000, () => console.log('Listening on localhost:3000'));
