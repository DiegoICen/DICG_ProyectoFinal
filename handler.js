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
    ciudad: '',
    estado: '',
  };
  if(!cpqro) {
    return res.send({
      error: `No se encuentra lo que buscas`
    });
  }
  if(!postalCode) {
    return res.send({
      error: `No se encuentra tu cp: ${postalCode}`
    });
  }
  const resultPostal = cpqro.filter( postal => postal.cp === postalCode);
  if(!resultPostal[0]) {
    return res.send({
      error: `No hay resultados para ${postalCode}`
    });
  }
  data.colonias = resultPostal.map(results => ({
    nombre: results.asentamiento,
    tipo: results.type,
  }))
  data.estado = resultPostal[0].estado;
  data.ciudad = resultPostal[0].municipio;
  res.send({
    data,
    error: null
  });
});

module.exports.generic = serverless(app);