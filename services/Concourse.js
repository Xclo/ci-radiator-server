"use strict";
const axios = require('axios');
const rp = require('request-promise');

const tokenType = 'bearer';

function Concourse() {
  return undefined;
}

const pipelines= (api, authorization, filter) => {

  const url = api;
  let qs = ''

  if (filter) {
    qs = filter;
  }
  const options = {
    method: "GET",
    url: url,
    headers: {
      Authorization: `${authorization}`
    },
    validateStatus: (status) => {
      return status === 200
    }
  };
  return axios(options);
}

Concourse.prototype.pipeline= (api, authorization, name, filter) => {

  const url = `${api}/v2/apps/${name}/`;
  let qs = {};

  if (filter) {
    qs = filter;
  }
  const options = {
    method: "GET",
    url: url,
    headers: {
      Authorization: `${authorization}`
    },
    q: qs,
    validateStatus: (status) => {
      return status === 200
    }
  };
  return axios(options);
}

const jobs = (api, authorization) => {
  const options = {
    method: "GET",
    url: api,
    headers: {
      Authorization: `${authorization}`
    },
    validateStatus: (status) => {
      return status === 200
    }
  };
  return axios(options);
}



Concourse.prototype.workers = (api, authorization) => {
  const options = {
    method: "GET",
    url: api,
    headers: {
      Authorization: `${authorization}`
    },
    validateStatus: (status) => {
      return status === 200
    }
  };
  return axios(options);
}


Concourse.prototype.login = (api, username, password, team) => {
  const url = `${api}/api/v1/teams/${team}/auth/token`;
  const options = {
    method: "GET",
    url: url,
    json: true
  };
  return rp(options).auth(username, password);
}


Concourse.prototype.getWorkers = (api,token,filter) => {
    const workerURL = req.api + "/api/v1/workers";
    return new Promise((resolve, reject) => {
      Concourse.workers(workerURL, token,filter).then((response) => {
        console.log(response);
      });
    });
}

Concourse.prototype.getPipelines = (api,token,filter) => {
  return new Promise((resolve, reject) => {
    pipelines(api, token,filter).then((response) => {
      // console.log(response)
      let pipelines = response.data.map((pipeline) => {
        return mapPipelineResponse(api, pipeline)
      });
      resolve(pipelines)
    });
  });
}

Concourse.prototype.getJobs = (api,token ,team, pipeline, filter) => {
  return new Promise((resolve, reject) => {
    const jobURL = api + "/api/v1/teams/" + team + "/pipelines/" + pipeline.name + '/jobs';
    console.log("Jobs URL ", jobURL)
    jobs(jobURL, token,filter).then((response) => {
      let data = {
        pipeline: pipeline.name,
        jobs: response.data
      }
      resolve(data)
    })
  });
  //https://concourse-c0.gcp.rjainpcf.com/api/v1/teams/ford/pipelines/blue-green-pipeline/jobs

}


const mapPipelineResponse = (api, pipeline) => {
  return {
    api: api + pipeline.url,   ///teams/ford/pipelines/blue-green-pipeline/jobs/unit-tests/builds/307
    name: pipeline.name, //https://concourse-c0.gcp.rjainpcf.com/api/v1/pipelines/teams/ford/pipelines/java-test
    paused: pipeline.paused,
    // paused:
  }
}




module.exports = Concourse;
