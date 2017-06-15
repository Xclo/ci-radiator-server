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

  function validateApiToken(req, res, next) {
    const api = req.headers.api;
    const authorization = req.headers.authorization;

    if (!api || !authorization) {
      res.status(400).send("Missing api endpoint or token");
      return;
    }
    req.api = api;
    req.authorization = authorization;

    next();
  }

  function handleError(res, error) {
    console.log('error', error);
    console.log('error response', error.response)
    if (error.response && error.response.status === 401) {
        res.status(401).send("unauthorized");
    } else {
        res.status(500).send("error");
    }

  }


  router.get('/pipelines', validateApiToken, (req, res) => {
    const api = req.headers.api;
    const pipelineURL = api + "/api/v1/pipelines";
    const authorization = req.headers.authorization;
    const team = req.headers.team;
    const filter = '';

    Concourse.getPipelines(pipelineURL, authorization).then((pipelines) => {
      //Concourse.getWorkers(api, authorization);
      let pipelinePromises = []
      console.log("getPipelienes Promise" , pipelines)
      pipelines.forEach((pipeline) => {
        // if (!pipeline.paused) {
          pipelinePromises.push(Concourse.getJobs(api,authorization, team, pipeline))
          // console.log(jobs)
        // }
      })

      Promise.all(pipelinePromises).then((responses) => {
        responses.forEach((response) => {
          // console.log('in promise.all', response)
          let jobs = response.jobs;
          // console.log(jobs)
          jobs.forEach((job) => {
            if (job.next_build)
            {
              job.status = job.next_build.status;
              job.id = job.next_build.id;
            }
            else if (job.finished_build)
            {
              job.status =  job.finished_build.status;
              job.id = job.finished_build.id;
            }
            else {
              job.status =  'non-exist';
            }
          })
          // console.log('pipelines', pipelines)
          let pipeline = _.find(pipelines, {name: response.pipeline})
          // console.log('pipeline', pipeline)
          pipeline.jobs = jobs
        })
        console.log('pipelines', pipelines)
        return res.json(pipelines);
      })
    }).catch((error) => {
      handleError(res, error);
    });
	});

  return router;
};
