/*
	This module generates/returns the contents of a page by its given name
 */

"use strict";

const fs = require('fs');


const load_page = (page,data)=>{
	return new Promise((resolve,reject)=>{
		switch(page){
			case "/":
				break;
			case "add":
				break;
			case "lookup":
			
		}
	});
}

module.exports = {
	load_page:load_page
}