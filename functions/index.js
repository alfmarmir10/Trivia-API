const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const express = require('express');
const app = express();

const fetch = require('node-fetch');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../client"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.post("/fetchQuestions", async (req, res) => {
  try {
    fetch(req.body.url)
    .then(objQuestions => objQuestions.json())
    .then(json => {
      console.log("JSON: "+json.results);
      res.status(200).send(json);
    })
  } catch(error){
    console.log(error);
  }
})

exports.app = functions.https.onRequest(app);