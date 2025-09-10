# Terminology API Reference

The AyushBridge Terminology API provides access to search, lookup, and translation services across multiple medical terminology systems including NAMASTE, ICD-11 TM2, Unani, and ICD-11.

## Base URL

All API requests should be prefixed with:

```
http://localhost:3000/fhir
```

In production, this will be your deployment URL.

## Authentication

APIs require authentication using ABHA OAuth 2.0. Include the authentication token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN
```

## Terminology Endpoints

### Autocomplete Search

Searches across multiple terminology systems with autocomplete functionality.

```
GET /terminology/$autocomplete
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | **Required**. The search term (min 2 characters) |
| systems | string | Comma-separated list of system identifiers to search (e.g., "namaste,icd11-tm2") |
| limit | integer | Maximum number of results to return (default: 20) |
| includeDesignations | boolean | Whether to include term designations in results (default: false) |
| includeMappings | boolean | Whether to include mappings in results (default: false) |

#### Example Request

```
GET /terminology/$autocomplete?search=vata&systems=namaste,icd11-tm2&limit=20&includeDesignations=true&includeMappings=true
```

#### Response Format

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "match",
      "part": [
        {
          "name": "code",
          "valueCoding": {
            "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",
            "code": "SR11",
            "display": "Vata Dosha"
          }
        },
        {
          "name": "score",
          "valueDecimal": 0.95
        },
        {
          "name": "terminology",
          "valueString": "NAMASTE"
        },
        {
          "name": "definition",
          "valueString": "A fundamental bodily humor in Ayurveda representing the elements of air and ether."
        },
        {
          "name": "designations",
          "valueString": "hi: वात दोष; sa: वातदोष"
        }
      ]
    },
    {
      "name": "match",
      "part": [
        // Additional matches
      ]
    }
  ]
}
```

### Dual Code Lookup

Retrieves detailed information about codes in both NAMASTE and ICD-11 systems, including bidirectional mappings.

```
GET /terminology/$dual-code-lookup
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| namasteCode | string | NAMASTE code to lookup |
| icd11Code | string | ICD-11 TM2 code to lookup |
| includeDetails | boolean | Whether to include detailed information (default: true) |
| includeHierarchy | boolean | Whether to include hierarchical relationships (default: false) |

**Note:** Either `namasteCode` OR `icd11Code` must be provided.

#### Example Request

```
GET /terminology/$dual-code-lookup?namasteCode=SR11&includeDetails=true&includeHierarchy=true
```

#### Response Format

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "result",
      "valueBoolean": true
    },
    {
      "name": "namaste",
      "part": [
        {
          "name": "code",
          "valueCoding": {
            "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",
            "code": "SR11",
            "display": "Vata Dosha"
          }
        },
        {
          "name": "definition",
          "valueString": "A fundamental bodily humor in Ayurveda representing the elements of air and ether."
        },
        {
          "name": "designations",
          "valueString": "hi: वात दोष; sa: वातदोष"
        }
      ]
    },
    {
      "name": "mappedIcd11Codes",
      "part": [
        {
          "name": "mapping",
          "part": [
            {
              "name": "targetCode",
              "valueCoding": {
                "system": "http://id.who.int/icd/release/11/mms",
                "code": "TM26.0",
                "display": "Disorders of vata dosha"
              }
            },
            {
              "name": "equivalence",
              "valueCode": "equivalent"
            }
          ]
        }
      ]
    }
  ]
}
```

### Translate

Translates codes between terminology systems.

```
POST /terminology/$translate
```

#### Request Body

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "code",
      "valueCode": "SR11"
    },
    {
      "name": "system",
      "valueUri": "https://ayush.gov.in/fhir/CodeSystem/namaste"
    },
    {
      "name": "target",
      "valueUri": "http://id.who.int/icd/release/11/mms"
    }
  ]
}
```

#### Response Format

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "result",
      "valueBoolean": true
    },
    {
      "name": "source",
      "valueCoding": {
        "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",
        "code": "SR11",
        "display": "Vata Dosha"
      }
    },
    {
      "name": "match",
      "part": [
        {
          "name": "equivalence",
          "valueCode": "equivalent"
        },
        {
          "name": "concept",
          "valueCoding": {
            "system": "http://id.who.int/icd/release/11/mms",
            "code": "TM26.0",
            "display": "Disorders of vata dosha"
          }
        },
        {
          "name": "comment",
          "valueString": "Mapping validated by domain experts"
        }
      ]
    }
  ]
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad request (invalid parameters)
- 401: Unauthorized (missing or invalid authentication)
- 404: Resource not found
- 500: Server error

Error responses follow this format:

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "processing",
      "diagnostics": "Detailed error message"
    }
  ]
}
```

## System URIs

When specifying terminology systems, use the following URIs:

| System | URI |
|--------|-----|
| NAMASTE | https://ayush.gov.in/fhir/CodeSystem/namaste |
| ICD-11 TM2 | http://id.who.int/icd/release/11/mms |
| Unani | https://ayush.gov.in/fhir/CodeSystem/unani |
| ICD-11 | https://icd.who.int/browse11/l-m/en |

## Terminology Mappings

AyushBridge supports the following mapping types:

| Code | Description |
|------|-------------|
| equivalent | The concepts are equivalent |
| wider | The source concept is wider than the target |
| narrower | The source concept is narrower than the target |
| inexact | The concepts overlap but are not the same |

## Rate Limits

API requests are limited to 60 requests per minute per authenticated user. Exceeding this limit will result in a 429 Too Many Requests response.
