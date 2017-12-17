

"use strict";

const express = require('express');
const router = express.Router();

const users = require('./mongoCollections').user;


const update_fav = (user,id)=>{
	return new Promise((resolve,reject)=>{
		users.findOne({name:user.name},function(err, result) {
	    	if (err) throw err;
	    	var new_favorites = new Array();
	    	if(result.favorites.length == 0){
	    		new_favorites.push(id);
	    	}else{
	    		var found = false;
	    		for(var i = 0;i<result.favorites.length;i++){
	    			if(result.favorites[i] == id){
	    				found = true;
	    				continue;
	    			}
	    			new_favorites.push(result.favorites[i]);
	    		}
	    		if(!found){
	    			new_favorites.push(id);
	    		}
	    		var new_vals = {favorites:new_favorites};
	    		users.updateOne({name:user.name},new_vals,function(err,res){
	    			if(err) reject(err);
	    			resolve(res);
	    		});
	    	}
	  	});
	});
}

router.get('/update_favorite',function(req,res){
	if(!req.user){
		res.status(403).send("");
		return;
	}
	update_fav(req.user,req.query.document_id).then((success)=>{
		res.status(200).send("success");
	}).catch((error)=>{
		res.status(500).send(error);
	});

});



module.exports = router