/*******************************************************************************
DigiBird request interpretation module

This module contains function that help parsing url parameters to interpret the
request.
*******************************************************************************/
let request = require('request-promise-native');
let platforms = require('../helpers/platforms');
let winston = require('winston');

module.exports = {
  objectParameters: function(query, res) {
    // retrieve information about the requested bird and platforms
    return this.birdParameters(query, res).then(parameters => {
      parameters.platforms = this.platformParameters(query, res);
      return parameters;
    });
  },
  statisticsParameters: function(query, res) {
    // retrieve one platform
    const platformParameter = this.platformParameter(query, res);

    if (platformParameter === null) {
      res.status(400).send('No platfom parameter provided');
      return false;
    } else {
      return platformParameter;
    }
  },
  birdParameters: function(query, res) {
    /* Return parameters object containging type of request and bird species
    *  This function interprets the type of object requested:
    *  1. Common name -> send request for additional information and add to parameters
    *  2. Genus -> verify genus exists, add to parameters
    *  3. Species -> extend with common names in dutch and english
    *  4. Incorrect parameters -> 400 response
    */
    let parameters = {};
    const commonInput = query.common_name;
    const genusInput = query.genus;
    const speciesInput = query.species;

    if (commonInput) {
      parameters.common_name = commonInput.toLowerCase();
      parameters.request = 'species';

      return this.getScientific(parameters.common_name).then(
        data => {
          const scientificName = JSON.parse(data);
          parameters.genus = scientificName.genus.toLowerCase();
          parameters.species = scientificName.species.toLowerCase();
          return parameters;
        },
        error => {
          res.status(400).send(`Common name ${parameters.common_name} is unknown.`);
        }
      );
    } else if (genusInput && !speciesInput) {
      parameters.genus = genusInput.toLowerCase();
      parameters.request = 'genus';

      return this.verifyGenus(parameters.genus).then(
        () => parameters,
        error => { res.status(400).send(`Genus ${parameters.genus} is unknown.`); }
      );
    } else if (genusInput && speciesInput) {
      parameters.genus = genusInput.toLowerCase();
      parameters.species = speciesInput.toLowerCase();
      parameters.request = 'species';

      return this.getCommon(parameters.genus, parameters.species).then(
        data => {
          const commonNames = JSON.parse(data);
          parameters.common_name = commonNames.en;
          if (commonNames.nl) parameters.common_name_nl = commonNames.nl;

          return parameters;
        },
        error => {
          res.status(400).send(`Species ${parameters.genus} ${parameters.species} is unknown.`);
        }
      );
    } else {
      res.status(400).send('Missing object parameter.');
    }
  },
  platformParameter: function(query, res) {
    /* Return platform string based on url parameter
     *
     *  Three situations to handle:
     *  1. No parameter given -> return null
     *  2. Correct platform parameter -> return input
     *  3. Platform does not exist -> 404 response & return false
     */
    const platformInput = query.platform;

    if(!platformInput) return null;

    if (platforms.exists(platformInput)) {
        return platformInput;
    } else {
        res.status(404).send(`${platformInput} platform parameter is unknown.`);
        return false;
    }
  },
  platformParameters: function(query, res) {
    /* Return array of platform strings based on url parameters
    *
    *  Three situations to handle:
    *  1. No parameter given -> return all available platforms
    *  2. Single parameter given -> put in array and loop once
    *  3. Array of platforms -> for every platform
    *     3.1 Correct platform parameter -> add to verified
    *     3.2 Platform does not exist -> 404 response & return false
    */
    let input = query.platform;
    let platformParameters = [];

    if (!input) return platforms.platformIds();
    // make sure to return an array
    input = typeof input === 'string' ? [input] : input;

    for (let i=0; i<input.length; i++) {
      if (platforms.exists(input[i])) {
        platformParameters.push(input[i]);
      } else {
        res.status(404).send(`${input[i]} platform parameter is unknown.`);
        return false;
      }
    }

    return platformParameters;
  },
  verifyGenus: function(genus) {
    const url = `${platforms.platform('ioc').endpoint_location}/verify`;
    const query = { "genus": genus};
    return request({ "url":url, "qs": query });
  },
  getScientific: function(common) {
    const url = `${platforms.platform('ioc').endpoint_location}/translate/common_name`;
    const query = { "name": common};
    return request({ "url":url, "qs": query });
  },
  getCommon: function(genus, species) {
    // return a promise of common names
    const url = `${platforms.platform('ioc').endpoint_location}/translate/scientific_name`;
    const query = { "genus": genus, "species": species };

    return request({ "url":url, "qs": query });
  },
  iocConceptFromInput: function(parameters) {
    // generate an uri based on parameters
    // TODO: consolidate/normalise using IOC birdnames?
    const nameSpace = 'http://purl.org/collections/birds/';
    let concept;

    switch(parameters.request) {
      case 'genus': return `${nameSpace}genus-${parameters.genus}`;
      case 'species': return `${nameSpace}species-${parameters.genus}_${parameters.species}`;
      case 'common': return 'not supported yet';
    }

    return concept;
  },
  mergeQueryParameters: function(parameters) {
    // merge the parameters if we can not query for specifc concepts
    switch(parameters.request) {
      case 'genus': return parameters.genus;
      case 'species': return `${parameters.genus} ${parameters.species}`;
      case 'common': return parameters.common_name;
    }
    // TODO: for the Rijksmuseum translate scientific names to common?
  }
}
