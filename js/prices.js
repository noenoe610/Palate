/* ===================================
   PRICES.JS - Budget Tracker / Cost Calculator
   =================================== */

const ingredientPrices = {
    // Proteins (price per standard unit)
    'chicken breast': { price: 6.99, unit: 'lb', standard_amount: 1 },
    'chicken thighs': { price: 5.99, unit: 'lb', standard_amount: 1 },
    'ground beef': { price: 5.99, unit: 'lb', standard_amount: 1 },
    'ground pork': { price: 4.99, unit: 'lb', standard_amount: 1 },
    'ground turkey': { price: 5.49, unit: 'lb', standard_amount: 1 },
    'bacon': { price: 7.99, unit: 'lb', standard_amount: 1 },
    'pork tenderloin': { price: 6.49, unit: 'lb', standard_amount: 1 },
    'salmon': { price: 12.99, unit: 'lb', standard_amount: 1 },
    'shrimp': { price: 11.99, unit: 'lb', standard_amount: 1 },
    'tofu': { price: 2.49, unit: 'block', standard_amount: 1 },
    'firm tofu': { price: 2.49, unit: 'block', standard_amount: 1 },
    'eggs': { price: 4.99, unit: 'dozen', standard_amount: 12 },
    'egg': { price: 0.42, unit: 'piece', standard_amount: 1 },
    
    // Vegetables (average prices)
    'onion': { price: 1.29, unit: 'lb', standard_amount: 1 },
    'red onion': { price: 1.49, unit: 'lb', standard_amount: 1 },
    'garlic': { price: 0.50, unit: 'head', standard_amount: 1 },
    'ginger': { price: 3.99, unit: 'lb', standard_amount: 1 },
    'tomatoes': { price: 2.99, unit: 'lb', standard_amount: 1 },
    'bell peppers': { price: 1.99, unit: 'piece', standard_amount: 1 },
    'jalapeño': { price: 0.30, unit: 'piece', standard_amount: 1 },
    'carrots': { price: 1.49, unit: 'lb', standard_amount: 1 },
    'celery': { price: 1.99, unit: 'bunch', standard_amount: 1 },
    'lettuce': { price: 2.49, unit: 'head', standard_amount: 1 },
    'spinach': { price: 2.99, unit: 'bunch', standard_amount: 1 },
    'napa cabbage': { price: 2.49, unit: 'head', standard_amount: 1 },
    'bean sprouts': { price: 1.99, unit: 'lb', standard_amount: 1 },
    'mushrooms': { price: 3.99, unit: 'lb', standard_amount: 1 },
    'shiitake mushrooms': { price: 5.99, unit: 'lb', standard_amount: 1 },
    'eggplant': { price: 1.99, unit: 'piece', standard_amount: 1 },
    'zucchini': { price: 1.49, unit: 'lb', standard_amount: 1 },
    'cucumber': { price: 0.99, unit: 'piece', standard_amount: 1 },
    
    // Fruits
    'lemon': { price: 0.79, unit: 'piece', standard_amount: 1 },
    'lime': { price: 0.50, unit: 'piece', standard_amount: 1 },
    'avocados': { price: 1.99, unit: 'piece', standard_amount: 1 },
    
    // Grains & Pasta
    'rice': { price: 1.50, unit: 'lb', standard_amount: 1 },
    'short-grain rice': { price: 2.49, unit: 'lb', standard_amount: 1 },
    'cooked rice': { price: 0.50, unit: 'cup', standard_amount: 1 },
    'pasta': { price: 1.29, unit: 'lb', standard_amount: 1 },
    'spaghetti': { price: 1.29, unit: 'lb', standard_amount: 1 },
    'elbow macaroni': { price: 1.29, unit: 'lb', standard_amount: 1 },
    'rice vermicelli': { price: 2.99, unit: 'lb', standard_amount: 1 },
    'flour': { price: 0.50, unit: 'lb', standard_amount: 1 },
    'breadcrumbs': { price: 2.99, unit: 'lb', standard_amount: 1 },
    
    // Legumes
    'chickpeas': { price: 1.29, unit: 'can', standard_amount: 1 },
    'lentils': { price: 1.99, unit: 'lb', standard_amount: 1 },
    
    // Dairy
    'butter': { price: 4.99, unit: 'lb', standard_amount: 1 },
    'milk': { price: 3.99, unit: 'gallon', standard_amount: 1 },
    'heavy cream': { price: 4.99, unit: 'pint', standard_amount: 1 },
    'sour cream': { price: 2.99, unit: 'cup', standard_amount: 1 },
    'cheese': { price: 5.99, unit: 'lb', standard_amount: 1 },
    'sharp cheddar': { price: 6.99, unit: 'lb', standard_amount: 1 },
    'parmesan': { price: 12.99, unit: 'lb', standard_amount: 1 },
    'pecorino romano': { price: 14.99, unit: 'lb', standard_amount: 1 },
    
    // Oils & Cooking
    'olive oil': { price: 0.50, unit: 'oz', standard_amount: 1 },
    'vegetable oil': { price: 0.30, unit: 'oz', standard_amount: 1 },
    'sesame oil': { price: 0.80, unit: 'oz', standard_amount: 1 },
    'coconut oil': { price: 0.60, unit: 'oz', standard_amount: 1 },
    
    // Sauces & Condiments
    'soy sauce': { price: 0.20, unit: 'tbsp', standard_amount: 1 },
    'fish sauce': { price: 0.25, unit: 'tbsp', standard_amount: 1 },
    'oyster sauce': { price: 0.30, unit: 'tbsp', standard_amount: 1 },
    'hoisin sauce': { price: 0.35, unit: 'tbsp', standard_amount: 1 },
    'vinegar': { price: 0.10, unit: 'tbsp', standard_amount: 1 },
    'tomato paste': { price: 0.40, unit: 'tbsp', standard_amount: 1 },
    
    // Spices & Herbs (price per typical recipe amount)
    'salt': { price: 0.01, unit: 'tsp', standard_amount: 1 },
    'black pepper': { price: 0.05, unit: 'tsp', standard_amount: 1 },
    'cumin': { price: 0.15, unit: 'tsp', standard_amount: 1 },
    'paprika': { price: 0.12, unit: 'tsp', standard_amount: 1 },
    'basil': { price: 2.99, unit: 'bunch', standard_amount: 1 },
    'cilantro': { price: 0.99, unit: 'bunch', standard_amount: 1 },
    'parsley': { price: 0.99, unit: 'bunch', standard_amount: 1 },
    
    // Default fallback
    'default': { price: 2.00, unit: 'unit', standard_amount: 1 }
};

// Calculate recipe cost
function calculateRecipeCost(recipe, servings) {
    if (!recipe || !recipe.ingredients) {
        return { total: 0, perServing: 0 };
    }
    
    const scaleFactor = servings / (recipe.servings?.base || 2);
    let totalCost = 0;
    
    recipe.ingredients.forEach(ing => {
        const ingredientName = ing.name.toLowerCase().trim();
        const priceData = ingredientPrices[ingredientName] || ingredientPrices['default'];
        
        // Rough cost estimation
        // This is simplified - in production you'd want more precise conversions
        const estimatedCost = priceData.price * (ing.amount * scaleFactor * 0.08);
        totalCost += estimatedCost;
    });
    
    return {
        total: totalCost.toFixed(2),
        perServing: (totalCost / servings).toFixed(2)
    };
}

// Get price breakdown by category
function getCostBreakdown(recipe, servings) {
    const breakdown = {
        protein: 0,
        vegetables: 0,
        grains: 0,
        dairy: 0,
        other: 0
    };
    
    const scaleFactor = servings / (recipe.servings?.base || 2);
    
    recipe.ingredients.forEach(ing => {
        const ingredientName = ing.name.toLowerCase().trim();
        const priceData = ingredientPrices[ingredientName] || ingredientPrices['default'];
        const estimatedCost = priceData.price * (ing.amount * scaleFactor * 0.08);
        
        const category = ing.category || 'other';
        if (breakdown[category] !== undefined) {
            breakdown[category] += estimatedCost;
        } else {
            breakdown.other += estimatedCost;
        }
    });
    
    return breakdown;
}
