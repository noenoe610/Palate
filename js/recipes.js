/* ===================================
   RECIPES.JS - Recipe Data Management
   =================================== */

const recipes = {
    // All recipes loaded from JSON
    allRecipes: [],
    
    // Current filters
    filters: {
        cuisine: null,
        maxTime: null,
        difficulty: null,
        equipment: null
    },
    
    // Initialize and load recipes
    loadRecipes: async function() {
        console.log('📖 Loading recipes...');
        try {
            const response = await fetch('data/recipes.json');
            const data = await response.json();
            this.allRecipes = data.recipes;
            console.log(`✅ Loaded ${this.allRecipes.length} recipes`);
        } catch (error) {
            console.error('❌ Error loading recipes:', error);
            // Fallback: use empty array
            this.allRecipes = [];
        }
    },
    
    // Get all recipes
    getAllRecipes: function() {
        return this.allRecipes;
    },
    
    // Get recipe by ID
    getRecipeById: function(id) {
        return this.allRecipes.find(r => r.id === id);
    },
    
    // Search recipes by query
    search: function(query) {
        const lowerQuery = query.toLowerCase();
        return this.allRecipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(lowerQuery) ||
                   recipe.description.toLowerCase().includes(lowerQuery) ||
                   recipe.cuisine.toLowerCase().includes(lowerQuery) ||
                   recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery));
        });
    },
    
    // Filter recipes by cuisine
    filterByCuisine: function(cuisine) {
        if (!cuisine || cuisine === 'All Cuisines') {
            return this.allRecipes;
        }
        return this.allRecipes.filter(r => r.cuisine === cuisine);
    },
    
    // Filter by max cooking time
    filterByTime: function(maxMinutes) {
        return this.allRecipes.filter(r => r.timing.total_time <= maxMinutes);
    },
    
    // Filter by difficulty
    filterByDifficulty: function(difficulty) {
        return this.allRecipes.filter(r => r.difficulty === difficulty.toLowerCase());
    },
    
    // Filter by available equipment
    filterByEquipment: function(availableEquipment) {
        return this.allRecipes.filter(recipe => {
            // Check if user has all required equipment OR if there are substitutions
            return recipe.equipment_required.every(required => {
                // User has the equipment
                if (availableEquipment.includes(required)) {
                    return true;
                }
                // Or there's a substitution available
                return recipe.equipment_substitutions.some(sub => 
                    sub.original === required && availableEquipment.includes(sub.substitute)
                );
            });
        });
    },
    
    // Filter by dietary tags
    filterByDiet: function(dietTag) {
        return this.allRecipes.filter(r => r.dietary_tags.includes(dietTag));
    },
    
    // Get recipes by multiple filters
    getFilteredRecipes: function(filters = {}) {
        let filtered = this.allRecipes;
        
        if (filters.cuisine) {
            filtered = filtered.filter(r => r.cuisine === filters.cuisine);
        }
        
        if (filters.maxTime) {
            filtered = filtered.filter(r => r.timing.total_time <= filters.maxTime);
        }
        
        if (filters.difficulty) {
            filtered = filtered.filter(r => r.difficulty === filters.difficulty);
        }
        
        if (filters.equipment && filters.equipment.length > 0) {
            filtered = this.filterByEquipment(filters.equipment);
        }
        
        if (filters.diet) {
            filtered = filtered.filter(r => r.dietary_tags.includes(filters.diet));
        }
        
        return filtered;
    },
    
    // Get personalized recipe recommendations
    getPersonalizedRecommendations: function(userPrefs, count = 10) {
        const prefs = userPrefs || userData.getPreferences();
        
        // Score each recipe based on user preferences
        const scored = this.allRecipes.map(recipe => {
            let score = 0;
            
            // Cuisine match
            if (prefs.cuisines.includes(recipe.cuisine)) {
                score += 20;
            }
            
            // Time match
            if (recipe.timing.total_time <= prefs.cookingTime) {
                score += 15;
            }
            
            // Difficulty match
            const difficultyMatch = {
                'beginner': 1,
                'intermediate': 2,
                'advanced': 3,
                'expert': 4
            };
            const userLevel = difficultyMatch[prefs.skillLevel] || 2;
            const recipeLevel = difficultyMatch[recipe.difficulty] || 2;
            if (Math.abs(userLevel - recipeLevel) <= 1) {
                score += 15;
            }
            
            // Priority scores (flavor, nutrition, healthiness)
            score += recipe.scores.flavor * prefs.priorities.flavor;
            score += recipe.scores.nutrition * prefs.priorities.nutrition;
            score += recipe.scores.healthiness * prefs.priorities.healthiness;
            
            // Equipment availability
            const hasEquipment = recipe.equipment_required.every(req => 
                prefs.equipment.includes(req) ||
                recipe.equipment_substitutions.some(sub => 
                    sub.original === req && prefs.equipment.includes(sub.substitute)
                )
            );
            if (hasEquipment) {
                score += 10;
            }
            
            return { recipe, score };
        });
        
        // Sort by score and return top results
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, count).map(s => s.recipe);
    },
    
    // Get recipes for weekly plan
    getWeeklyRecipes: function(userPrefs) {
        const prefs = userPrefs || userData.getPreferences();
        const adventure = prefs.adventure || 'balanced';
        
        // Get user's recipe history
        const history = userData.data.recipeHistory || [];
        const recentRecipes = history.slice(-14); // Last 14 recipes
        
        // Categorize recipes
        const tried = this.allRecipes.filter(r => history.includes(r.id));
        const new_recipes = this.allRecipes.filter(r => !history.includes(r.id));
        const mastered = tried.filter(r => userData.isRecipeMastered(r.id));
        
        // Determine mix based on adventure level
        let mix = { repeats: 0, new: 7 }; // Default: all new
        
        if (adventure === 'comfort' && tried.length > 0) {
            mix = { repeats: 5, new: 2 }; // Mostly familiar
        } else if (adventure === 'balanced' && tried.length > 0) {
            mix = { repeats: 3, new: 4 }; // Mix
        } else if (adventure === 'explorer') {
            mix = { repeats: 1, new: 6 }; // Mostly new
        }
        
        const weekPlan = [];
        
        // Add repeat recipes (favorites and mastered)
        if (mix.repeats > 0 && tried.length > 0) {
            const repeatCandidates = tried
                .filter(r => !recentRecipes.slice(-7).includes(r.id)) // Not in last week
                .sort((a, b) => {
                    // Prioritize favorites and mastered
                    const aFav = userData.isFavorite(a.id) ? 10 : 0;
                    const bFav = userData.isFavorite(b.id) ? 10 : 0;
                    const aMas = userData.isRecipeMastered(a.id) ? 5 : 0;
                    const bMas = userData.isRecipeMastered(b.id) ? 5 : 0;
                    return (bFav + bMas) - (aFav + aMas);
                });
            
            weekPlan.push(...repeatCandidates.slice(0, mix.repeats));
        }
        
        // Add new recipes (personalized)
        const newNeeded = 7 - weekPlan.length;
        if (newNeeded > 0) {
            const newCandidates = this.getPersonalizedRecommendations(prefs, 20)
                .filter(r => !weekPlan.find(p => p.id === r.id))
                .filter(r => !recentRecipes.includes(r.id));
            
            weekPlan.push(...newCandidates.slice(0, newNeeded));
        }
        
        // Ensure variety in cuisines
        const finalPlan = this.ensureCuisineVariety(weekPlan);
        
        return finalPlan.slice(0, 7);
    },
    
    // Ensure cuisine variety in weekly plan
    ensureCuisineVariety: function(recipes) {
        const cuisineCounts = {};
        const varied = [];
        const remainder = [];
        
        for (const recipe of recipes) {
            cuisineCounts[recipe.cuisine] = (cuisineCounts[recipe.cuisine] || 0) + 1;
            
            // Allow max 2 from same cuisine in a week
            if (cuisineCounts[recipe.cuisine] <= 2) {
                varied.push(recipe);
            } else {
                remainder.push(recipe);
            }
        }
        
        // If we removed too many, add back
        if (varied.length < 7 && remainder.length > 0) {
            varied.push(...remainder.slice(0, 7 - varied.length));
        }
        
        return varied;
    },
    
    // Get cuisine distribution for a set of recipes
    getCuisineDistribution: function(recipeList) {
        const distribution = {};
        
        recipeList.forEach(recipe => {
            distribution[recipe.cuisine] = (distribution[recipe.cuisine] || 0) + 1;
        });
        
        // Convert to percentages
        const total = recipeList.length;
        const percentages = {};
        for (const [cuisine, count] of Object.entries(distribution)) {
            percentages[cuisine] = Math.round((count / total) * 100);
        }
        
        return percentages;
    },
    
    // Get all unique cuisines
    getAllCuisines: function() {
        const cuisines = new Set(this.allRecipes.map(r => r.cuisine));
        return Array.from(cuisines).sort();
    },
    
    // Get popular recipes (most liked)
    getPopularRecipes: function(count = 10) {
        return [...this.allRecipes]
            .sort((a, b) => b.user_stats.likes - a.user_stats.likes)
            .slice(0, count);
    },
    
    // Get quickest recipes
    getQuickestRecipes: function(count = 10) {
        return [...this.allRecipes]
            .sort((a, b) => a.timing.total_time - b.timing.total_time)
            .slice(0, count);
    },
    
    // Increment recipe likes (simulates community engagement)
    likeRecipe: function(recipeId) {
        const recipe = this.getRecipeById(recipeId);
        if (recipe) {
            recipe.user_stats.likes++;
            // In a real app, this would save to a database
            // For now, it persists only during the session
        }
    },
    
    // Get popular recipes this week (most liked recently)
    getPopularThisWeek: function(count = 5) {
        // In a real app, this would filter by date
        // For now, just return most liked overall
        return this.getPopularRecipes(count);
    }
};
