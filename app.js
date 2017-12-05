// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

"use strict";

const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

app.listen(3000, () => console.log("Listening on localhost:3000"));
