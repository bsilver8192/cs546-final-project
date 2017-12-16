


"use strict";


/**
 * Returns a promise which evaluates to the search results
 * @param  Object params 
 *         	_id
 *         	url
 *         	model_numbers
 *         	manufacturer
 *         	documentType
 *         	uploader
 * @return Promise->Results(Array)   
 */
const search = (params)=>{
	return new Promise((resolve,reject)=>{
		const mango = require("./mongoCollections");
	  	
	  	mango.document.find(params).toArray(function(err, result) {
	    	if (err) throw err;
	    	resolve(result);
	    	db.close();
	  	});
		
		
	});
}


module.exports = {
	search: search
}