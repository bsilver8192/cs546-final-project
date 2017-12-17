// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project
"use strict";

const express = require('express');
const router = express.Router();
const mongoCol = require("./mongoCollections");
const userPromise = require('./mongoCollections').user;

/**
 * Returns a promise which evaluates to the search results
 * Performs a simple search. 
 * @param  Object params 
 *         	_id
 *         	url
 *         	model_numbers
 *         	manufacturer
 *         	documentType
 *         	uploader
 * @return Promise->Results(Array)
 */
const basic_search = async(params)=>{
	var documents = await mongoCol.document;
	return await documents.find(params).toArray();
}

/**
 * Handles the searching from documents based on model number and optionally
 * document type. Honestly, there is probably a way to do this directly in the mongo query
 * @param  Object req The request body given from express
 * @return Array      A promise resolving to an array of the results matching the search query or rejecting to 
 *                     an error. 
 */
const search = async(req)=>{
		let search_param = {};
		if(req.body.doc_type != ''){
			search_param.documentType = req.body.doc_type;
		}
		const results = await basic_search(search_param);

		let matches = new Array();
		for(let i = 0;i<results.length;i++){
			if (req.body.part_no == '') {
				matches.push(results[i]);
			} else {
				for(var j = 0;j<results[i].model_numbers.length;j++){
					if(req.body.part_no == '' || results[i].model_numbers[j] == req.body.part_no){
						matches.push(results[i]);
						break;
					}
				}
			}
		}
		for (let i = 0; i < matches.length; ++i) {
			if (req.user && req.user.favorites.indexOf(matches[i]._id) != -1) {
				matches[i].classes = 'favorite selected';
			} else {
				matches[i].classes = 'favorite';
			}
		}
		return matches;
}


router.get('/',function(req,res){
	res.render('search', {
		results: [],
		user: req.user,
	});
});

router.post('/',async(req,res)=>{
	var response;
	try{
		response = await search(req);
		res.render('search',{
			results:response,
			user: req.user,
		});
	}catch(error){
		res.status(500).render('search',{
			error:error,
			user: req.user,
		});
	}
});

module.exports = router;