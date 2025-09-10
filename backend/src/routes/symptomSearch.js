const express = require('express');
const { asyncHandler, ValidationError } = require('../middleware/errorHandler');
const { validateFHIRRequest } = require('../middleware/requestLogger');
const { PrismaClient } = require('@prisma/client');
const Fuse = require('fuse.js');

const router = express.Router();
const prisma = new PrismaClient();

// Apply FHIR validation to all routes
router.use(validateFHIRRequest);

/**
 * POST /fhir/symptom-search - Fuzzy search for symptoms and conditions
 * Body: {
 *   "description": "45 year old male with chest pain and breathlessness"
 * }
 */
router.post('/', asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== 'string') {
    throw new ValidationError('description is required and must be a string');
  }

  // Parse the description to extract components
  const parsedData = parseDescription(description);

  // Get all code system concepts for fuzzy search
  const concepts = await prisma.codeSystemConcept.findMany({
    include: {
      codeSystem: true,
      designations: true
    },
    take: 10000 // Limit for performance, adjust as needed
  });

  // Prepare data for fuzzy search
  const searchData = concepts.map(concept => ({
    id: concept.id,
    code: concept.code,
    display: concept.display || '',
    definition: concept.definition || '',
    codeSystem: concept.codeSystem.name || concept.codeSystem.title || '',
    allText: `${concept.display || ''} ${concept.definition || ''} ${concept.designations.map(d => d.value).join(' ')}`.toLowerCase()
  }));

  // Fuzzy search options
  const fuseOptions = {
    keys: [
      { name: 'display', weight: 0.4 },
      { name: 'definition', weight: 0.3 },
      { name: 'allText', weight: 0.3 }
    ],
    threshold: 0.4, // Lower threshold = more strict matching
    includeScore: true,
    includeMatches: true
  };

  const fuse = new Fuse(searchData, fuseOptions);

  // Search for each symptom
  const symptomMatches = [];
  const symptoms = parsedData.symptoms;

  for (const symptom of symptoms) {
    const results = fuse.search(symptom);
    if (results.length > 0) {
      symptomMatches.push({
        symptom,
        matches: results.slice(0, 10).map(result => ({
          concept: {
            id: result.item.id,
            code: result.item.code,
            display: result.item.display,
            definition: result.item.definition,
            codeSystem: result.item.codeSystem
          },
          score: result.score,
          matches: result.matches
        }))
      });
    }
  }

  // Search for age-related conditions if age is provided
  let ageMatches = [];
  if (parsedData.age) {
    const ageQuery = `${parsedData.age} year old`;
    const ageResults = fuse.search(ageQuery);
    ageMatches = ageResults.slice(0, 5).map(result => ({
      concept: {
        id: result.item.id,
        code: result.item.code,
        display: result.item.display,
        definition: result.item.definition,
        codeSystem: result.item.codeSystem
      },
      score: result.score
    }));
  }

  // Search for gender-related conditions if gender is provided
  let genderMatches = [];
  if (parsedData.gender) {
    const genderResults = fuse.search(parsedData.gender);
    genderMatches = genderResults.slice(0, 5).map(result => ({
      concept: {
        id: result.item.id,
        code: result.item.code,
        display: result.item.display,
        definition: result.item.definition,
        codeSystem: result.item.codeSystem
      },
      score: result.score
    }));
  }

  // Combine and rank results
  const combinedResults = {
    parsedInput: parsedData,
    symptomMatches,
    ageMatches,
    genderMatches,
    topMatches: getTopMatches(symptomMatches, ageMatches, genderMatches)
  };

  res.json({
    resourceType: 'Bundle',
    type: 'searchset',
    timestamp: new Date().toISOString(),
    total: combinedResults.topMatches.length,
    entry: combinedResults.topMatches.map(match => ({
      resource: {
        resourceType: 'CodeSystemConcept',
        id: match.concept.id,
        code: match.concept.code,
        display: match.concept.display,
        definition: match.concept.definition,
        codeSystem: match.concept.codeSystem,
        _score: match.combinedScore
      }
    })),
    _parsedData: combinedResults.parsedInput,
    _symptomMatches: combinedResults.symptomMatches,
    _metadata: {
      searchDescription: description,
      totalConceptsSearched: searchData.length,
      searchTimestamp: new Date().toISOString()
    }
  });
}));

/**
 * Parse natural language description to extract age, gender, and symptoms
 */
function parseDescription(description) {
  const lowerDesc = description.toLowerCase();

  // Extract age
  const ageMatch = lowerDesc.match(/(\d+)\s*(?:year|yr)s?\s*old/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : null;

  // Extract gender
  let gender = null;
  if (lowerDesc.includes('male') || lowerDesc.includes('man') || lowerDesc.includes('boy')) {
    gender = 'male';
  } else if (lowerDesc.includes('female') || lowerDesc.includes('woman') || lowerDesc.includes('girl')) {
    gender = 'female';
  }

  // Extract symptoms (words that could be medical symptoms)
  const commonSymptoms = [
    'pain', 'chest pain', 'breathlessness', 'shortness of breath', 'cough', 'fever',
    'headache', 'nausea', 'vomiting', 'dizziness', 'fatigue', 'weakness',
    'swelling', 'rash', 'itching', 'bleeding', 'bruising', 'numbness',
    'tingling', 'burning', 'stiffness', 'inflammation', 'infection'
  ];

  const words = lowerDesc.split(/\s+/);
  const symptoms = [];

  // Check for exact symptom matches
  for (const symptom of commonSymptoms) {
    if (lowerDesc.includes(symptom)) {
      symptoms.push(symptom);
    }
  }

  // Also extract any medical-sounding words (this is a simple heuristic)
  const medicalWords = words.filter(word =>
    word.length > 3 &&
    !['with', 'and', 'the', 'has', 'have', 'year', 'old', 'male', 'female', 'patient'].includes(word) &&
    /^[a-z]+$/.test(word)
  );

  // Combine and deduplicate
  const allSymptoms = [...new Set([...symptoms, ...medicalWords])];

  return {
    age,
    gender,
    symptoms: allSymptoms,
    originalDescription: description
  };
}

/**
 * Get top matches by combining and ranking results
 */
function getTopMatches(symptomMatches, ageMatches, genderMatches) {
  const allMatches = new Map();

  // Add symptom matches with higher weight
  symptomMatches.forEach(symptomGroup => {
    symptomGroup.matches.forEach(match => {
      const key = match.concept.id;
      const existing = allMatches.get(key);
      const score = (1 - match.score) * 0.7; // Convert fuse score to relevance score

      if (!existing || score > existing.score) {
        allMatches.set(key, {
          concept: match.concept,
          score,
          source: 'symptom'
        });
      }
    });
  });

  // Add age matches with medium weight
  ageMatches.forEach(match => {
    const key = match.concept.id;
    const existing = allMatches.get(key);
    const score = (1 - match.score) * 0.5;

    if (!existing) {
      allMatches.set(key, {
        concept: match.concept,
        score,
        source: 'age'
      });
    } else if (score > existing.score * 0.3) { // Boost existing matches slightly
      existing.score += score * 0.3;
    }
  });

  // Add gender matches with lower weight
  genderMatches.forEach(match => {
    const key = match.concept.id;
    const existing = allMatches.get(key);
    const score = (1 - match.score) * 0.3;

    if (!existing) {
      allMatches.set(key, {
        concept: match.concept,
        score,
        source: 'gender'
      });
    } else if (score > existing.score * 0.2) { // Boost existing matches slightly
      existing.score += score * 0.2;
    }
  });

  // Convert to array and sort by score
  return Array.from(allMatches.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Return top 20 matches
}

module.exports = router;
