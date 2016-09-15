/*******************************************************************************
DigiBird request interpretation module

This module contains function that help parsing url parameters to interpret the
request.
*******************************************************************************/
let platforms = require('../helpers/platforms');

module.exports = {
  objectParameters: function(query, res) {
    // retrieve information about the requested bird and platforms
    let parameters = this.birdParameters(query, res);
    parameters.platforms = this.platformParameters(query, res);

    return parameters;
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
    *
    *  This function interprets the type of object requested:
    *  1. No parameters provided -> 400 response & return nul
    *  2. Input is added to parameters object and request property is set to
    *     most specific type of object query (common -> genus -> species)
    */
    let parameters = {};
    const commonInput = query.common_name;
    const genusInput = query.genus;
    const speciesInput = query.species;

    if (!commonInput && !genusInput && !speciesInput) {
      res.status(400).send('No object parameters provided');
      return null;
    }
    if (commonInput) {
      // TODO: match the input with loaded list
      parameters.common_name = commonInput.toLowerCase();
      parameters.request = 'common';
    }
    if (genusInput) {
      // TODO: match the input with loaded list
      parameters.genus = genusInput.toLowerCase();
      parameters.request = 'genus';
    }
    if (speciesInput) {
      // TODO: match the input with loaded list
      parameters.species = speciesInput.toLowerCase();
      parameters.request = 'species'; // make the request type more specific
    }
    return parameters;
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
  }
}
