# DigiBird API: on the fly collection integration
[DigiBird](http://www.digibird.org) is a system that integrates cultural heritage data on the fly. Check out the website: [www.digibird.org](http://www.digibird.org). This repository contains code for the API code, code for the client can found in another [repository](https://github.com/rasvaan/digibird_client).

## Example API call
Quick example querying for sounds of a Magpie from Xeno-canto:

http://www.digibird.org/api/objects?platform=xeno-canto&genus=Pica&species=pica

This will give you a rather complex JSON-LD response:

```
{
  "@context": {
    "dcterms": "http://purl.org/dc/terms/",
    "dctype": "http://purl.org/dc/dcmitype/",
    "ore": "http://www.openarchives.org/ore/terms/",
    "edm": "http://www.europeana.eu/schemas/edm/",
    "dcterms:type": {
      "@type": "@id"
    },
    "edm:aggregatedCHO": {
      "@type": "@id"
    },
    "edm:hasView": {
      "@type": "@id"
    }
  },
  "@graph": [
    {
      "@id": "http://www.xeno-canto.org/276751/aggregation",
      "@type": "ore:Aggregation",
      "edm:aggregatedCHO": {
        "@id": "http://www.xeno-canto.org/276751",
        "@type": "edm:ProvidedCHO"
      },
      "edm:hasView": {
        "@id": "http://www.xeno-canto.org/276751/download",
        "@type": "edm:WebResource",
        "dcterms:type": "dctype:Sound"
      }
    }
  ]
}
```

Content negotiation can be used to request other formats.

# API Documentation
The base of the api is http://www.digibird.org/api/

## Media API
If you want to request media you can use this url:  http://www.digibird.org/api/objects
You can use the following parameters for media:

### Platform
The platform you would like to get media from. Supported platforms right now:

* Xeno-canto (id: xeno-canto) - Bird sounds
* Rijksmuseum (id: rijksmuseum) - Artworks, substring matching only
* Accurator (id: accurator) - Rijksmuseum artworks annotated with scientific names
* Nederlands Soorten Register (id: soortenregister) - Images of birds

You can request media from multiple platforms by adding multiple parameters:
http://www.digibird.org/api/objects?platform=xeno-canto&platform=soortenregister

Omitting the platform parameter results in querying all available platforms

### Genus
This parameter is used to specify the genus of the specimens you would like to see media of:
http://www.digibird.org/api/objects?platform=xeno-canto&genus=Pica

It is not yet verified whether the genus/species exist, this might be implemented at a later point. Now an empty result set will be returned.  

### Species
This parameter is used in combination with the genus parameter to specify the search query:
http://www.digibird.org/api/objects?platform=xeno-canto&genus=Pica&species=pica

For now either the genus or the genus plus the species is required, at a later point we will support using common name queries.

## Annotations API
If you want to request the latest contributions on a crowdsourcing platform you can use this url:  http://www.digibird.org/api/annotations
You can use the following parameters for annotations:

### Platform
The platform you would like to get media from. Supported platforms right now:

* Waisda? (id: waisda) - Videos and their corresponding tags
* Accurator (id: accurator) - Rijksmuseum artworks annotated with scientific names

An example of the json-ld that is returned:
```
{
  "@graph": [
    {
      "@id":"http://hdl.handle.net/10934/RM0001.collect.89134%3Aaggregation",
      "@type":"ore:Aggregation",
      "edm:aggregatedCHO":{
        "@id":"http://purl.org/collections/nl/rma/RP-P-1878-A-710",
        "@type":"edm:ProvidedCHO",
        "dc:creator":"Visscher, Claes Jansz. (II)",
        "dc:title":"Kroonkraanvogel tussen twee struisvogels"
      },
      "edm:isShownBy":{
        "@id":"http://lh5.ggpht.com/iuEgYC__Qh4QLIRtiwBF5PBq3WIZAgQEF26LuVNmLEgDISluVuPGiDv",
        "@type":"edm:WebResource",
        "dcterms:type":"dctype:Image"
      }
    }
    {
      "@id":"http://localhost/annotation/instances/id_09d7d022c762ba830386ee66de8c8250635bb2de",
      "@type":"oa:Annotation",
      "oa:hasTarget":"http://purl.org/collections/nl/rma/RP-P-1878-A-710",
      "oa:hasBody":"struisvogel",
      "oa:annotatedAt":"2016-10-31T16:34:33+01:00"
    }
  ]
}
```
The response contains two elements, an object and an annotation of the object. This model conforms to the [web annotation model](https://www.w3.org/TR/annotation-model/).

## Content negotiation
Supported media-types:

* application/ld+json
* application/json
* text/turtle
* application/n-quads

If you set the accept-header to json, it will give you a plain json response:

```
curl -H "Accept: application/json" "http://www.digibird.org/api/objects?platform=soortenregister&genus=Pica&species=pica"
```

The reply will be formatted like this:

```
{"results": [
  {"url":"http://www.nederlandsesoorten.nl/464942884_2091265265",
   "media_url":"http://images.naturalis.nl/original/132623.jpg",
   "media_type":”Image"
  }
]}
```
