/* ===================================
   SUBSTITUTIONS.JS - Ingredient Substitution Engine
   =================================== */

const substitutions = {
    // Database of common ingredient substitutions
    database: {
        // Dairy
        'butter': [
            { substitute: 'coconut oil', ratio: '1:1', note: 'Use refined for neutral flavor' },
            { substitute: 'olive oil', ratio: '3:4', note: '3/4 cup oil per 1 cup butter' },
            { substitute: 'applesauce', ratio: '1:1', note: 'For baking only, reduce sugar slightly' }
        ],
        'milk': [
            { substitute: 'almond milk', ratio: '1:1', note: 'Unsweetened works best' },
            { substitute: 'oat milk', ratio: '1:1', note: 'Creamier texture' },
            { substitute: 'coconut milk', ratio: '1:1', note: 'Adds coconut flavor' }
        ],
        'heavy cream': [
            { substitute: 'coconut cream', ratio: '1:1', note: 'Chilled can of coconut milk, use thick part' },
            { substitute: 'cashew cream', ratio: '1:1', note: 'Blend soaked cashews with water' }
        ],
        'sour cream': [
            { substitute: 'greek yogurt', ratio: '1:1', note: 'Plain, full-fat works best' },
            { substitute: 'coconut cream + lemon', ratio: '1:1', note: 'Add 1 tbsp lemon per cup' }
        ],
        'parmesan': [
            { substitute: 'pecorino romano', ratio: '1:1', note: 'Saltier, use less salt in recipe' },
            { substitute: 'nutritional yeast', ratio: '1:2', note: 'For vegan, less salty' }
        ],
        
        // Eggs
        'eggs': [
            { substitute: 'flax eggs', ratio: '1 egg = 1 tbsp ground flax + 3 tbsp water', note: 'Let sit 5 min to gel' },
            { substitute: 'chia eggs', ratio: '1 egg = 1 tbsp chia + 3 tbsp water', note: 'Let sit 5 min' },
            { substitute: 'applesauce', ratio: '1 egg = 1/4 cup', note: 'For baking only' },
            { substitute: 'banana', ratio: '1 egg = 1/4 cup mashed', note: 'Adds banana flavor' }
        ],
        
        // Proteins
        'chicken breast': [
            { substitute: 'turkey breast', ratio: '1:1', note: 'Very similar texture' },
            { substitute: 'pork tenderloin', ratio: '1:1', note: 'Slightly richer flavor' },
            { substitute: 'tofu', ratio: '1:1', note: 'Press well, marinate longer' }
        ],
        'ground beef': [
            { substitute: 'ground turkey', ratio: '1:1', note: 'Leaner, may need added fat' },
            { substitute: 'ground pork', ratio: '1:1', note: 'Fattier, richer flavor' },
            { substitute: 'lentils', ratio: '1:1', note: 'Cooked, for vegetarian option' }
        ],
        'bacon': [
            { substitute: 'pancetta', ratio: '1:1', note: 'Italian style, less smoky' },
            { substitute: 'prosciutto', ratio: '1:1', note: 'Saltier, thinner' },
            { substitute: 'smoked paprika + olive oil', ratio: 'flavor only', note: 'For smoky flavor without meat' }
        ],
        
        // Aromatics
        'garlic': [
            { substitute: 'garlic powder', ratio: '1 clove = 1/8 tsp powder', note: 'Less pungent' },
            { substitute: 'shallots', ratio: '1 clove = 1 small shallot', note: 'Milder, sweeter' }
        ],
        'onion': [
            { substitute: 'shallots', ratio: '1 onion = 3 shallots', note: 'Sweeter, more delicate' },
            { substitute: 'leeks', ratio: '1 onion = 1 cup sliced leeks', note: 'Milder flavor' }
        ],
        'ginger': [
            { substitute: 'ground ginger', ratio: '1 tbsp fresh = 1/4 tsp ground', note: 'Less bright' },
            { substitute: 'galangal', ratio: '1:1', note: 'More citrusy, common in Thai' }
        ],
        
        // Asian Sauces
        'soy sauce': [
            { substitute: 'tamari', ratio: '1:1', note: 'Gluten-free, slightly less salty' },
            { substitute: 'coconut aminos', ratio: '1:1', note: 'Soy-free, slightly sweeter' },
            { substitute: 'worcestershire + salt', ratio: '1:1', note: 'Similar umami, different flavor' }
        ],
        'fish sauce': [
            { substitute: 'soy sauce', ratio: '1:1', note: 'Less funky, more salty' },
            { substitute: 'worcestershire', ratio: '1:1', note: 'Different flavor profile' },
            { substitute: 'miso paste + water', ratio: '1 tbsp = 1 tsp miso + 2 tsp water', note: 'Fermented flavor' }
        ],
        'oyster sauce': [
            { substitute: 'hoisin sauce', ratio: '1:1', note: 'Sweeter, thicker' },
            { substitute: 'soy sauce + sugar', ratio: '1 tbsp = 1 tbsp soy + 1 tsp sugar', note: 'Simpler flavor' }
        ],
        
        // Acids
        'lemon juice': [
            { substitute: 'lime juice', ratio: '1:1', note: 'More tart' },
            { substitute: 'white wine vinegar', ratio: '1:1', note: 'Less fresh' },
            { substitute: 'apple cider vinegar', ratio: '1:1', note: 'Fruitier' }
        ],
        'vinegar': [
            { substitute: 'lemon juice', ratio: '1:1', note: 'Fresher flavor' },
            { substitute: 'lime juice', ratio: '1:1', note: 'More aromatic' }
        ],
        
        // Sweeteners
        'sugar': [
            { substitute: 'honey', ratio: '1:3/4', note: '3/4 cup honey per 1 cup sugar, reduce liquid' },
            { substitute: 'maple syrup', ratio: '1:3/4', note: 'Adds maple flavor' },
            { substitute: 'coconut sugar', ratio: '1:1', note: 'Lower glycemic' }
        ],
        'brown sugar': [
            { substitute: 'white sugar + molasses', ratio: '1 cup = 1 cup sugar + 1 tbsp molasses', note: 'Mix well' },
            { substitute: 'coconut sugar', ratio: '1:1', note: 'Similar caramel notes' }
        ],
        
        // Flours & Starches
        'all-purpose flour': [
            { substitute: 'bread flour', ratio: '1:1', note: 'Chewier texture' },
            { substitute: 'whole wheat flour', ratio: '1:1', note: 'Denser, nuttier' },
            { substitute: 'gluten-free flour blend', ratio: '1:1', note: 'Check if xanthan gum included' }
        ],
        'cornstarch': [
            { substitute: 'arrowroot powder', ratio: '1:1', note: 'Better for acidic dishes' },
            { substitute: 'potato starch', ratio: '1:1', note: 'Withstands higher heat' },
            { substitute: 'flour', ratio: '1:2', note: '2 tbsp flour per 1 tbsp cornstarch' }
        ],
        
        // Herbs & Spices
        'fresh basil': [
            { substitute: 'dried basil', ratio: '1 tbsp fresh = 1 tsp dried', note: 'Less aromatic' },
            { substitute: 'fresh oregano', ratio: '1:1', note: 'Different but Mediterranean' }
        ],
        'fresh cilantro': [
            { substitute: 'fresh parsley', ratio: '1:1', note: 'Milder, no "soap" taste' },
            { substitute: 'fresh basil', ratio: '1:1', note: 'Different but fresh' }
        ],
        'cumin': [
            { substitute: 'ground coriander', ratio: '1:1', note: 'Citrusy instead of earthy' },
            { substitute: 'caraway seeds', ratio: '1:1', note: 'Similar earthy note' }
        ]
    },
    
    // Find substitutions for an ingredient
    find: function(ingredientName) {
        const nameLower = ingredientName.toLowerCase().trim();
        
        // Exact match
        if (this.database[nameLower]) {
            return this.database[nameLower];
        }
        
        // Partial match
        for (const key in this.database) {
            if (nameLower.includes(key) || key.includes(nameLower)) {
                return this.database[key];
            }
        }
        
        return null;
    },
    
    // Get all available substitutions
    getAllSubstitutions: function() {
        return Object.keys(this.database).sort();
    }
};
