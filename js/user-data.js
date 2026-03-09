/* ===================================
   USER-DATA.JS - User Data Management
   =================================== */

const userData = {
    // Default user data structure
    defaultData: {
        isNew: true,
        onboardingComplete: false,
        goal: null,
        household: 2,
        leftovers: true,
        adventure: 'balanced',
        cuisines: [],
        equipment: ['pan', 'knife-set'],
        priorities: {
            flavor: 5,
            nutrition: 3,
            healthiness: 2,
            difficulty: 3
        },
        cookingTime: 30,
        skillLevel: 'intermediate',
        units: 'imperial',  // 'metric' or 'imperial'
        stats: {
            recipiesTried: 0,
            recipesMastered: 0,
            newThisWeek: 0,
            totalCookingSessions: 0
        },
        recipeHistory: [],
        favorites: [],
        weeklyPlan: null,
        multiWeekPlan: [],  // Array of weekly plans: [{weekNumber: 1, plan: [...]}]
        currentWeekIndex: 0,  // Which week we're viewing (0-3)
        pantryStaples: [
            // Common items most people have
            'salt',
            'black pepper',
            'vegetable oil',
            'olive oil'
        ],
        recipeNotes: {},  // { recipeId: "my notes here" }
        recipeProgress: {},  // { recipeId: { completedSteps: [0, 1, 2], completedIngredients: [0, 1] } }
        recipePhotos: {},  // { recipeId: ["data:image/png;base64,...", ...] }
        collections: []  // [{ id, name, recipeIds: [], color, icon, createdAt }]
    },
    
    // Current user data
    data: null,
    
    // Initialize user data
    init: function() {
        console.log('📊 Initializing user data...');
        this.load();
    },
    
    // Load user data from localStorage
    load: function() {
        const stored = localStorage.getItem('palate_user_data');
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                console.log('✅ User data loaded from localStorage');
            } catch (e) {
                console.error('❌ Error parsing user data:', e);
                this.data = { ...this.defaultData };
            }
        } else {
            this.data = { ...this.defaultData };
            console.log('✨ New user detected');
        }
    },
    
    // Save user data to localStorage
    save: function() {
        try {
            localStorage.setItem('palate_user_data', JSON.stringify(this.data));
            console.log('💾 User data saved');
        } catch (e) {
            console.error('❌ Error saving user data:', e);
        }
    },
    
    // Check if user is new
    isNewUser: function() {
        return this.data.isNew || !this.data.onboardingComplete;
    },
    
    // Complete onboarding
    completeOnboarding: function(onboardingData) {
        this.data = {
            ...this.data,
            ...onboardingData,
            isNew: false,
            onboardingComplete: true
        };
        this.save();
        console.log('✅ Onboarding complete!');
    },
    
    // Get user preferences
    getPreferences: function() {
        return {
            goal: this.data.goal,
            household: this.data.household,
            leftovers: this.data.leftovers,
            adventure: this.data.adventure,
            cuisines: this.data.cuisines,
            equipment: this.data.equipment,
            priorities: this.data.priorities,
            cookingTime: this.data.cookingTime,
            skillLevel: this.data.skillLevel
        };
    },
    
    // Update preferences
    updatePreferences: function(newPrefs) {
        this.data = {
            ...this.data,
            ...newPrefs
        };
        this.save();
        console.log('✅ Preferences updated');
    },
    
    // Reset preferences to defaults
    resetPreferences: function() {
        this.data.priorities = { ...this.defaultData.priorities };
        this.data.cookingTime = this.defaultData.cookingTime;
        this.data.skillLevel = this.defaultData.skillLevel;
        this.save();
        console.log('🔄 Preferences reset to defaults');
    },
    
    // Get user stats
    getStats: function() {
        return this.data.stats;
    },
    
    // Update stats
    updateStats: function(newStats) {
        this.data.stats = {
            ...this.data.stats,
            ...newStats
        };
        this.save();
    },
    
    // Mark recipe as tried
    markRecipeTried: function(recipeId) {
        if (!this.data.recipeHistory.includes(recipeId)) {
            this.data.recipeHistory.push(recipeId);
            this.data.stats.recipiesTried++;
            this.save();
        }
    },
    
    // Check if recipe is mastered (cooked 3+ times)
    isRecipeMastered: function(recipeId) {
        const count = this.data.recipeHistory.filter(id => id === recipeId).length;
        return count >= 3;
    },
    
    // Get recipe cook count
    getRecipeCookCount: function(recipeId) {
        return this.data.recipeHistory.filter(id => id === recipeId).length;
    },
    
    // Add to favorites
    addFavorite: function(recipeId) {
        if (!this.data.favorites.includes(recipeId)) {
            this.data.favorites.push(recipeId);
            this.save();
        }
    },
    
    // Remove from favorites
    removeFavorite: function(recipeId) {
        this.data.favorites = this.data.favorites.filter(id => id !== recipeId);
        this.save();
    },
    
    // Check if recipe is favorited
    isFavorite: function(recipeId) {
        return this.data.favorites.includes(recipeId);
    },
    
    // Get favorites
    getFavorites: function() {
        return this.data.favorites;
    },
    
    // Set weekly plan
    setWeeklyPlan: function(plan) {
        this.data.weeklyPlan = plan;
        this.save();
    },
    
    // Get weekly plan
    getWeeklyPlan: function() {
        return this.data.weeklyPlan;
    },
    
    // Reset all data (nuclear option)
    resetAllData: function() {
        if (confirm('⚠️ This will delete ALL your data. Are you absolutely sure?')) {
            localStorage.removeItem('palate_user_data');
            this.data = { ...this.defaultData };
            this.save();
            console.log('🗑️ All user data deleted');
            location.reload();
        }
    },
    
    // Export user data (for backup)
    exportData: function() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'palate-backup-' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
        console.log('💾 User data exported');
    },
    
    // Import user data (from backup)
    importData: function(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = imported;
            this.save();
            console.log('✅ User data imported');
            location.reload();
        } catch (e) {
            console.error('❌ Error importing data:', e);
            alert('Error importing data. Please check the file.');
        }
    },
    
    // Get pantry staples
    getPantryStaples: function() {
        return this.data.pantryStaples || this.defaultData.pantryStaples;
    },
    
    // Add pantry staple
    addPantryStaple: function(item) {
        if (!this.data.pantryStaples) {
            this.data.pantryStaples = [...this.defaultData.pantryStaples];
        }
        
        const itemLower = item.toLowerCase().trim();
        if (!this.data.pantryStaples.includes(itemLower)) {
            this.data.pantryStaples.push(itemLower);
            this.save();
            return true;
        }
        return false;
    },
    
    // Remove pantry staple
    removePantryStaple: function(item) {
        if (!this.data.pantryStaples) return false;
        
        const itemLower = item.toLowerCase().trim();
        const index = this.data.pantryStaples.indexOf(itemLower);
        if (index > -1) {
            this.data.pantryStaples.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    },
    
    // Check if item is in pantry
    hasPantryStaple: function(item) {
        const pantry = this.getPantryStaples();
        const itemLower = item.toLowerCase().trim();
        return pantry.some(staple => itemLower.includes(staple) || staple.includes(itemLower));
    },
    
    // Get recipe note
    getRecipeNote: function(recipeId) {
        if (!this.data.recipeNotes) {
            this.data.recipeNotes = {};
        }
        return this.data.recipeNotes[recipeId] || '';
    },
    
    // Save recipe note
    saveRecipeNote: function(recipeId, note) {
        if (!this.data.recipeNotes) {
            this.data.recipeNotes = {};
        }
        this.data.recipeNotes[recipeId] = note.trim();
        this.save();
    },
    
    // Delete recipe note
    deleteRecipeNote: function(recipeId) {
        if (!this.data.recipeNotes) return;
        delete this.data.recipeNotes[recipeId];
        this.save();
    },
    
    // Get recipe progress
    getRecipeProgress: function(recipeId) {
        if (!this.data.recipeProgress) {
            this.data.recipeProgress = {};
        }
        return this.data.recipeProgress[recipeId] || { completedSteps: [], completedIngredients: [] };
    },
    
    // Toggle step completion
    toggleStepCompletion: function(recipeId, stepIndex) {
        if (!this.data.recipeProgress) {
            this.data.recipeProgress = {};
        }
        if (!this.data.recipeProgress[recipeId]) {
            this.data.recipeProgress[recipeId] = { completedSteps: [], completedIngredients: [] };
        }
        
        const steps = this.data.recipeProgress[recipeId].completedSteps;
        const index = steps.indexOf(stepIndex);
        
        if (index > -1) {
            steps.splice(index, 1);
        } else {
            steps.push(stepIndex);
        }
        
        this.save();
    },
    
    // Toggle ingredient completion
    toggleIngredientCompletion: function(recipeId, ingredientIndex) {
        if (!this.data.recipeProgress) {
            this.data.recipeProgress = {};
        }
        if (!this.data.recipeProgress[recipeId]) {
            this.data.recipeProgress[recipeId] = { completedSteps: [], completedIngredients: [] };
        }
        
        const ingredients = this.data.recipeProgress[recipeId].completedIngredients;
        const index = ingredients.indexOf(ingredientIndex);
        
        if (index > -1) {
            ingredients.splice(index, 1);
        } else {
            ingredients.push(ingredientIndex);
        }
        
        this.save();
    },
    
    // Reset recipe progress
    resetRecipeProgress: function(recipeId) {
        if (!this.data.recipeProgress) return;
        delete this.data.recipeProgress[recipeId];
        this.save();
    },
    
    // Get recipe photos
    getRecipePhotos: function(recipeId) {
        if (!this.data.recipePhotos) {
            this.data.recipePhotos = {};
        }
        return this.data.recipePhotos[recipeId] || [];
    },
    
    // Add recipe photo
    addRecipePhoto: function(recipeId, photoDataURL) {
        if (!this.data.recipePhotos) {
            this.data.recipePhotos = {};
        }
        if (!this.data.recipePhotos[recipeId]) {
            this.data.recipePhotos[recipeId] = [];
        }
        
        // Limit to 5 photos per recipe to avoid localStorage bloat
        if (this.data.recipePhotos[recipeId].length >= 5) {
            alert('Maximum 5 photos per recipe. Delete one first!');
            return false;
        }
        
        this.data.recipePhotos[recipeId].push(photoDataURL);
        this.save();
        return true;
    },
    
    // Delete recipe photo
    deleteRecipePhoto: function(recipeId, photoIndex) {
        if (!this.data.recipePhotos || !this.data.recipePhotos[recipeId]) return;
        
        this.data.recipePhotos[recipeId].splice(photoIndex, 1);
        
        // Clean up empty arrays
        if (this.data.recipePhotos[recipeId].length === 0) {
            delete this.data.recipePhotos[recipeId];
        }
        
        this.save();
    },
    
    // Get multi-week plan
    getMultiWeekPlan: function() {
        if (!this.data.multiWeekPlan) {
            this.data.multiWeekPlan = [];
        }
        return this.data.multiWeekPlan;
    },
    
    // Set multi-week plan
    setMultiWeekPlan: function(multiWeekPlan) {
        this.data.multiWeekPlan = multiWeekPlan;
        this.save();
    },
    
    // Get current week index
    getCurrentWeekIndex: function() {
        return this.data.currentWeekIndex || 0;
    },
    
    // Set current week index
    setCurrentWeekIndex: function(index) {
        this.data.currentWeekIndex = index;
        this.save();
    },
    
    // Get units preference
    getUnits: function() {
        return this.data.units || 'imperial';
    },
    
    // Set units preference
    setUnits: function(units) {
        this.data.units = units;
        this.save();
    },
    
    // Convert units
    convertUnits: function(amount, fromUnit, toSystem) {
        const conversions = {
            // Volume
            'cup_to_ml': 236.588,
            'tbsp_to_ml': 14.787,
            'tsp_to_ml': 4.929,
            'fl_oz_to_ml': 29.574,
            
            // Weight
            'lb_to_g': 453.592,
            'oz_to_g': 28.350,
            
            // Temperature
            'f_to_c': (f) => (f - 32) * 5/9,
            'c_to_f': (c) => (c * 9/5) + 32
        };
        
        // Map units to conversion factors
        const unitMap = {
            'cup': { metric: 'ml', factor: conversions.cup_to_ml },
            'tbsp': { metric: 'ml', factor: conversions.tbsp_to_ml },
            'tsp': { metric: 'ml', factor: conversions.tsp_to_ml },
            'fl_oz': { metric: 'ml', factor: conversions.fl_oz_to_ml },
            'lb': { metric: 'g', factor: conversions.lb_to_g },
            'oz': { metric: 'g', factor: conversions.oz_to_g }
        };
        
        const unit = fromUnit.toLowerCase();
        
        if (toSystem === 'metric' && unitMap[unit]) {
            return {
                amount: amount * unitMap[unit].factor,
                unit: unitMap[unit].metric
            };
        }
        
        // If already in target system or no conversion needed
        return { amount, unit: fromUnit };
    },
    
    // Get all collections
    getCollections: function() {
        if (!this.data.collections) {
            this.data.collections = [];
        }
        return this.data.collections;
    },
    
    // Create new collection
    createCollection: function(name, icon = '📁', color = '#FF7700') {
        if (!this.data.collections) {
            this.data.collections = [];
        }
        
        const collection = {
            id: 'collection-' + Date.now(),
            name: name,
            recipeIds: [],
            icon: icon,
            color: color,
            createdAt: new Date().toISOString()
        };
        
        this.data.collections.push(collection);
        this.save();
        return collection;
    },
    
    // Add recipe to collection
    addToCollection: function(collectionId, recipeId) {
        const collection = this.data.collections.find(c => c.id === collectionId);
        if (collection && !collection.recipeIds.includes(recipeId)) {
            collection.recipeIds.push(recipeId);
            this.save();
            return true;
        }
        return false;
    },
    
    // Remove recipe from collection
    removeFromCollection: function(collectionId, recipeId) {
        const collection = this.data.collections.find(c => c.id === collectionId);
        if (collection) {
            collection.recipeIds = collection.recipeIds.filter(id => id !== recipeId);
            this.save();
            return true;
        }
        return false;
    },
    
    // Delete collection
    deleteCollection: function(collectionId) {
        this.data.collections = this.data.collections.filter(c => c.id !== collectionId);
        this.save();
    },
    
    // Get recipes in collection
    getCollectionRecipes: function(collectionId) {
        const collection = this.data.collections.find(c => c.id === collectionId);
        return collection ? collection.recipeIds : [];
    }
};
