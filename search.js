


"use strict";



const express = require('express');
const router = express.Router();


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
const basic_search = (params)=>{
	return new Promise((resolve,reject)=>{
		const mango = require("./mongoCollections");
	  	
	  	mango.document.find(params).toArray(function(err, result) {
	    	if (err) throw err;
	    	resolve(result);
	  	});
		
		
	});
}

/**
 * Handles the searching from documents based on model number and optionally
 * document type. Honestly, there is probably a way to do this directly in the mongo query
 * @param  Object req The request body given from express
 * @return Array      A promise resolving to an array of the results matching the search query or rejecting to 
 *                     an error. 
 */
const search = async(req)=>{
		var search_param = {};
		console.log(req.body);
		if(req.body == undefined){
			console.log("ERROR, req undefined");
			throw "ERROR";
		}
		if(req.body.doc_type){
			search_param.documentType = req.body.doc_type;
		}
		search(search_param).then(results=>{
			if(!results || results.length == 0){
				throw "No Results";
				return;
			}
			var matches = new Array();
			for(var i = 0;i<results.length;i++){
				for(var j = 0;j<results[i].model_numbers.length;j++){
					if(results[i].model_numbers[j] == req.body.part_no){
						matches.push(results[i]);
					}
				}
			}
			if(matches.length == 0){
				throw "No Results";
			}
			var output = "";
			//construct the html
			for(var i = 0;i<matches.length;i++){
				output += "<div class=\"result\">"+
							"<button onclick=\"handle_favorite('"+matches[i]._id+"')\">"+
							"<p><span>Location: </span>"+matches[i].url+"</p>"+
							"<ul>"+
							"<li><span>Model Numbers<span></li>";
				for(var j = 0;j<matches[i].model_numbers.length;j++){
					output += "<li>"+ matches[i].model_numbers[j]+"</li>";

				}
				output +=	"</ul>"+
							"<p><span>Manufacturer: </span>"+matches[i].manufacturer+"</p>"+
						 	"<p><span>Document Type: </span>"+matches[i].documentType+"</p>"+
						 	"<p><span>Uploader: </span>" + matches[i].uploader +"</p>"+
						 +"</div>";

			}

			return output;
		});

	
}


router.get('/search',function(req,res){
	res.render('search',{});
});

router.post('/search',function(req,res){
	search(req).catch((error)=>{
		res.status(500).render('search',{
				error:error
			});
	}).then((results)=>{
		if(error){
			
		}else{
			res.render('search',{results:results});
		}
	});
});

module.exports = router;