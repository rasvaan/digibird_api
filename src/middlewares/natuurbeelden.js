/*******************************************************************************
DigiBird retreival of Natuurbeelden collection metadata

This is the server backend to connect to the BenG Elastic Search instance
containing the Natuurbeelden video collections.

The script can be run individually with the following command:
node ./src/middlewares/natuurbeelden.js

*******************************************************************************/

var elasticsearch = require('elasticsearch');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');
var credentials = require('./natuurbeelden_credentials');
var winston = require('winston');

module.exports = {
    getBenGMetadata: function() {

        var client = new elasticsearch.Client({
            protocol: '',
            host: 'lbes1.beeldengeluid.nl',
            port: '9200',
            auth: credentials.AUTH
        });

        client.ping({
          requestTimeout: 30000,

          // undocumented params are appended to the query string
          hello: "elasticsearch!"
        }, function (error) {
            if (error) {
            winston.log('error', "Error connecting to the elasticsearch server.");
            return;
            } else {
              console.log('All is well');
            }
        });
    }
}
