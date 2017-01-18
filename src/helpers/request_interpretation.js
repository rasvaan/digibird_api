/*******************************************************************************
DigiBird request interpretation module

This module contains function that help parsing url parameters to interpret the
request.
*******************************************************************************/
let request = require('request-promise-native');
let platforms = require('../helpers/platforms');
let winston = require('winston');
var { InterpretError } = require('../classes/Errors');

module.exports = {
  objectParameters: function(query) {
    // retrieve information about the requested bird and platforms
    return this.birdParameters(query).then(parameters => {
      parameters.platforms = this.platformArrayParameter(query);
      return parameters;
    });
  },
  annotationParameters: function(query) {
    // return parameters object containging platform or date and platform
    const platformId = this.platformParameter(query);
    const date = this.dateParser(query.since);

    if (platformId && !date) {
      // proper request, platform but no date
      const platform = platforms.platform(platformId);
      return { "platform": platform };
    } else if (platformId && date) {
      // all good
      const platform = platforms.platform(platformId);
      return { "platform": platform, "date": date };
    }
  },
  birdParameters: function(query) {
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
          if (scientificName.en) parameters.common_name = scientificName.en.toLowerCase();
          if (scientificName.nl) parameters.common_name_nl = scientificName.nl.toLowerCase();

          return parameters;
        },
        error => {
          throw new InterpretError(`Common name ${parameters.common_name} is unknown.`, 400);
        }
      );
    } else if (genusInput && !speciesInput) {
      parameters.genus = genusInput.toLowerCase();
      parameters.request = 'genus';

      return this.verifyGenus(parameters.genus).then(
        () => parameters,
        error => { throw new InterpretError(`Genus ${parameters.genus} is unknown.`, 400); }
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
          throw new InterpretError(`Species ${parameters.genus} ${parameters.species} is unknown.`, 400);
        }
      );
    } else {
      throw new InterpretError(`Missing object parameter.`, 400);
    }
  },
  dateParser: function(dateString) {
    /* Date parameters are expected to be provided in ISO-8601 format.
     * example: 2011-10-10T14:48:00
     *
     * Three situations to handle:
     * 1. DateString is undefined -> return null
     * 2. DateString is valid -> return date
     * 3. DateString is invalid -> throw error
     */
    const date = dateString ? new Date(dateString) : null;

    if (date && isNaN(date.getTime()))
      throw new InterpretError(`${dateString} is not a valid date.`, 400);

    return date;
  },
  platformArrayParameter: function(query) {
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
        throw new InterpretError(`${input[i]} platform parameter is unknown.`, 404);
      }
    }

    return platformParameters;
  },
  platformParameter: function(query) {
    /* Return platform string based on url parameter
     *
     *  Three situations to handle:
     *  1. No parameter given -> return null
     *  2. Correct platform parameter -> return input
     *  3. Platform does not exist -> 404 response & return false
     */
    let parameter = query.platform;

    if (!parameter) throw new InterpretError('No platfom parameter provided.', 400);

    if (platforms.exists(parameter)) {
      return parameter;
    } else {
      throw new InterpretError(`${parameter} platform parameter is unknown.`, 404);
    }
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
    const nameSpace = 'http://purl.org/collections/birds/';
    let concept;

    switch(parameters.request) {
      case 'genus': return `${nameSpace}genus-${parameters.genus}`;
      case 'species': return `${nameSpace}species-${parameters.genus}_${parameters.species}`;
    }

    return concept;
  }
}
