/*jslint node: true*/
"use strict";

var bodyParser = require('body-parser');
const async = require('async');
const Promise = require('bluebird');
const _ = require('lodash');
const axios = require('axios');

const CI = require("../services/Concourse");
const Concourse = new CI();

module.exports = function (express) {

  var router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded

  router.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const api = req.body.api;
    const team = req.body.team;
    console.log(req.body);

    if (!username || !password || !api || !team) {
      res.status(400).send("Missing username, password, team or api endpoint");
      return;
    }

    Concourse.login(api, username, password,team).then(function (result) {
      res.json(result);
    }).catch((error) => {
      console.log(error);
      res.send(error);
    });
  });

  return router;
};
