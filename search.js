


"use strict";


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
	    	mango.close();
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
const search = (req)=>{
	return new Promise((resolve,reject)=>{
		var search_param = {};
		if(req.body.hasOwnProperty("doc_type")){
			search_param.documentType = req.body.doc_type;
		}
		search(search_param).then(results=>{
			if(!results || results.length == 0){
				reject("No Results");
				return;
			}
			var output = new Array();
			for(var i = 0;i<results.length;i++){
				for(var j = 0;j<results[i].model_numbers.length;j++){
					if(results[i].model_numbers[j] == req.body.part_no){
						output.push(results[i]);
					}
				}
			}
			resolve(output);
		});

	});
}

module.exports = {
	search:search
}