// Netlify Function for Recipe Import
const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body);
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Fetch the recipe page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract recipe data from JSON-LD (most recipe sites use this)
    let recipeData = null;
    
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const data = JSON.parse($(elem).html());
        
        // Handle arrays of JSON-LD objects
        const recipes = Array.isArray(data) ? data : [data];
        
        for (const item of recipes) {
          if (item['@type'] === 'Recipe' || 
              (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
            recipeData = item;
            break;
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });

    if (!recipeData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Could not find recipe data on this page',
          suggestion: 'Try a different URL or use manual import'
        })
      };
    }

    // Convert to Palate format
    const palateRecipe = convertToPalateFormat(recipeData, url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(palateRecipe)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to import recipe',
        message: error.message 
      })
    };
  }
};

// Convert recipe data to Palate format
function convertToPalateFormat(recipeData, sourceUrl) {
  // Generate unique ID
  const id = 'recipe-' + Date.now().toString().slice(-6);
  
  // Extract timing
  const totalTime = parseDuration(recipeData.totalTime) || 30;
  const prepTime = parseDuration(recipeData.prepTime) || Math.floor(totalTime * 0.3);
  const cookTime = parseDuration(recipeData.cookTime) || Math.floor(totalTime * 0.7);
  
  // Extract ingredients
  const ingredients = (recipeData.recipeIngredient || []).map((ing, index) => {
    const parsed = parseIngredient(ing);
    return {
      id: `ing-${id}-${index}`,
      name: parsed.name,
      amount: parsed.amount || 1,
      unit: parsed.unit || 'piece',
      preparation: parsed.preparation || '',
      category: guessCategory(parsed.name)
    };
  });
  
  // Extract instructions
  const instructions = (recipeData.recipeInstructions || []).map((inst, index) => {
    const text = typeof inst === 'string' ? inst : (inst.text || inst.name || '');
    return {
      step: index + 1,
      title: `Step ${index + 1}`,
      instruction: text,
      ingredients_used: [],
      timer_seconds: null,
      tips: ''
    };
  });
  
  // Build Palate recipe
  return {
    id: id,
    name: recipeData.name || 'Imported Recipe',
    cuisine: recipeData.recipeCuisine || 'International',
    region: recipeData.recipeCuisine || 'Various',
    description: recipeData.description || '',
    timing: {
      prep_time: prepTime,
      cook_time: cookTime,
      total_time: totalTime
    },
    servings: {
      base: parseInt(recipeData.recipeYield) || 4,
      scalable: true
    },
    difficulty: guessDifficulty(instructions.length, totalTime),
    scores: {
      flavor: 4,
      nutrition: 3,
      healthiness: 3,
      difficulty: 2
    },
    dietary_tags: extractDietaryTags(recipeData),
    allergens: [],
    equipment_required: ['knife', 'pan'],
    equipment_substitutions: [],
    ingredients: ingredients,
    instructions: instructions,
    nutrition: extractNutrition(recipeData.nutrition),
    storage: {
      fridge: '3 days',
      freezer: 'Not tested',
      reheating: 'Reheat gently'
    },
    attribution: {
      source: 'Imported from web',
      inspiration: sourceUrl,
      tested_by: 'User',
      date_added: new Date().toISOString().split('T')[0]
    },
    user_stats: {
      likes: 0,
      times_cooked: 0,
      average_rating: 0
    }
  };
}

// Helper: Parse ISO 8601 duration to minutes
function parseDuration(duration) {
  if (!duration) return null;
  
  // PT1H30M format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (match) {
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    return hours * 60 + minutes;
  }
  
  return null;
}

// Helper: Parse ingredient string
function parseIngredient(ingredientStr) {
  // Simple parsing - can be improved
  const fractionMap = {
    '¼': 0.25, '½': 0.5, '¾': 0.75,
    '⅓': 0.33, '⅔': 0.67,
    '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
  };
  
  let str = ingredientStr;
  
  // Replace fractions
  Object.keys(fractionMap).forEach(frac => {
    str = str.replace(frac, fractionMap[frac]);
  });
  
  // Extract amount and unit
  const match = str.match(/^(\d+\.?\d*)\s*(\w+)?\s+(.+)/);
  
  if (match) {
    return {
      amount: parseFloat(match[1]),
      unit: match[2] || 'piece',
      name: match[3].split(',')[0].trim(),
      preparation: match[3].includes(',') ? match[3].split(',').slice(1).join(',').trim() : ''
    };
  }
  
  return {
    amount: 1,
    unit: 'piece',
    name: ingredientStr,
    preparation: ''
  };
}

// Helper: Guess ingredient category
function guessCategory(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.match(/chicken|beef|pork|lamb|turkey|fish|shrimp|salmon/)) return 'protein';
  if (nameLower.match(/onion|garlic|ginger|shallot/)) return 'aromatics';
  if (nameLower.match(/carrot|celery|pepper|tomato|lettuce|spinach|broccoli/)) return 'vegetables';
  if (nameLower.match(/apple|lemon|lime|orange|banana/)) return 'fruit';
  if (nameLower.match(/rice|pasta|noodle|bread|flour/)) return 'grains';
  if (nameLower.match(/milk|cream|cheese|butter|yogurt/)) return 'dairy';
  if (nameLower.match(/salt|pepper|cumin|paprika|oregano|basil|thyme/)) return 'spice';
  if (nameLower.match(/soy sauce|vinegar|ketchup|mayo|mustard/)) return 'sauce';
  if (nameLower.match(/oil|olive oil|vegetable oil/)) return 'cooking';
  
  return 'other';
}

// Helper: Guess difficulty
function guessDifficulty(stepCount, totalTime) {
  if (stepCount <= 5 && totalTime <= 30) return 'beginner';
  if (stepCount <= 8 && totalTime <= 60) return 'intermediate';
  return 'advanced';
}

// Helper: Extract dietary tags
function extractDietaryTags(recipeData) {
  const tags = [];
  const keywords = (recipeData.keywords || '').toLowerCase();
  const description = (recipeData.description || '').toLowerCase();
  const combined = keywords + ' ' + description;
  
  if (combined.match(/vegetarian/)) tags.push('vegetarian');
  if (combined.match(/vegan/)) tags.push('vegan');
  if (combined.match(/gluten.free/)) tags.push('gluten-free');
  if (combined.match(/dairy.free/)) tags.push('dairy-free');
  
  return tags;
}

// Helper: Extract nutrition
function extractNutrition(nutritionData) {
  if (!nutritionData) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      per_serving: true
    };
  }
  
  return {
    calories: parseInt(nutritionData.calories) || 0,
    protein: parseInt(nutritionData.proteinContent) || 0,
    carbs: parseInt(nutritionData.carbohydrateContent) || 0,
    fat: parseInt(nutritionData.fatContent) || 0,
    fiber: parseInt(nutritionData.fiberContent) || 0,
    per_serving: true
  };
}
