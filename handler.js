'use strict';

const serverless = require('serverless-http');
const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const cpqro = require('./data/cpqro.json')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/postales/:postalcode', (req, res) => {
  const postalCode = req.params.postalcode;
  const data = {
    colonias: [],
    city: '',
    state: '',
  };
  if(!cpqro) {
    return res.send({
      data,
      err: `missing database`
    });
  }
  if(!postalCode) {
    return res.send({
      data,
      err: `missing postal code ${postalCode}`
    });
  }
  const resultPostal = cpqro.filter( postal => postal.cp === postalCode);
  if(!resultPostal[0]) {
    return res.send({
      data,
      err: `not result for ${postalCode}`
    });
  }
  data.colonias = resultPostal.map(results => ({
    name: results.asentamiento,
    type: results.type,
  }))
  data.state = resultPostal[0].estado;
  data.city = resultPostal[0].municipio;
  res.send({
    data,
    err: null
  });
});

module.exports.generic = serverless(app);