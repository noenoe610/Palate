/* ===================================
   MEAL-PLAN.JS - Weekly Meal Planning
   =================================== */

const mealPlan = {
    currentPlan: null,
    
    // Generate a new weekly meal plan
    generateWeeklyPlan: function() {
        console.log('📅 Generating weekly meal plan...');
        
        const userPrefs = userData.getPreferences();
        const weeklyRecipes = recipes.getWeeklyRecipes(userPrefs);
        
        // Create plan with days
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.currentPlan = weeklyRecipes.map((recipe, index) => ({
            day: days[index],
            dayShort: days[index].substring(0, 3),
            recipe: recipe,
            status: this.getRecipeStatus(recipe.id)
        }));
        
        // Save to userData
        userData.setWeeklyPlan(this.currentPlan);
        
        console.log('✅ Weekly plan generated:', this.currentPlan);
        return this.currentPlan;
    },
    
    // Get recipe status (new, repeat, mastered)
    getRecipeStatus: function(recipeId) {
        const cookCount = userData.getRecipeCookCount(recipeId);
        
        if (cookCount === 0) {
            return { badge: 'new', label: '🆕 New', color: 'blue' };
        } else if (cookCount >= 3) {
            return { badge: 'mastered', label: '⭐ Mastered', color: 'green' };
        } else {
            return { badge: 'repeat', label: '🔁 Making Again', color: 'yellow' };
        }
    },
    
    // Regenerate weekly plan
    regenerateWeek: function() {
        if (confirm('Generate a new meal plan for this week?')) {
            this.generateWeeklyPlan();
            app.showPage('weekly-plan');
        }
    },
    
    // Generate multi-week plan (2-4 weeks)
    generateMultiWeekPlan: function(numberOfWeeks = 2) {
        console.log(`📅 Generating ${numberOfWeeks}-week meal plan...`);
        
        const multiWeekPlan = [];
        const usedRecipeIds = new Set(); // Track recipes already used
        
        for (let week = 0; week < numberOfWeeks; week++) {
            const userPrefs = userData.getPreferences();
            
            // Get recipes but exclude already used ones
            let weeklyRecipes = this.getWeeklyRecipesExcluding(userPrefs, usedRecipeIds);
            
            // If we run out of recipes, allow repeats
            if (weeklyRecipes.length < 7) {
                weeklyRecipes = recipes.getWeeklyRecipes(userPrefs);
            }
            
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const weekPlan = weeklyRecipes.map((recipe, index) => {
                usedRecipeIds.add(recipe.id); // Mark as used
                return {
                    day: days[index],
                    dayShort: days[index].substring(0, 3),
                    recipe: recipe,
                    status: this.getRecipeStatus(recipe.id)
                };
            });
            
            multiWeekPlan.push({
                weekNumber: week + 1,
                startDate: this.getWeekStartDate(week),
                plan: weekPlan
            });
        }
        
        userData.setMultiWeekPlan(multiWeekPlan);
        userData.setCurrentWeekIndex(0);
        
        console.log('✅ Multi-week plan generated:', multiWeekPlan);
        return multiWeekPlan;
    },
    
    // Get weekly recipes excluding already used ones
    getWeeklyRecipesExcluding: function(userPrefs, excludeIds) {
        const prefs = userPrefs || userData.getPreferences();
        const adventure = prefs.adventure || 'balanced';
        
        // Get user's recipe history
        const history = userData.data.recipeHistory || [];
        const recentRecipes = history.slice(-14);
        
        // Filter out excluded recipes
        const availableRecipes = recipes.getAllRecipes().filter(r => !excludeIds.has(r.id));
        
        if (availableRecipes.length < 7) {
            // Not enough recipes, return what we have
            return availableRecipes;
        }
        
        // Categorize available recipes
        const tried = availableRecipes.filter(r => history.includes(r.id));
        const new_recipes = availableRecipes.filter(r => !history.includes(r.id));
        
        // Determine mix based on adventure level
        let mix = { repeats: 0, new: 7 };
        
        if (adventure === 'comfort' && tried.length > 0) {
            mix = { repeats: 5, new: 2 };
        } else if (adventure === 'balanced' && tried.length > 0) {
            mix = { repeats: 3, new: 4 };
        } else if (adventure === 'explorer') {
            mix = { repeats: 1, new: 6 };
        }
        
        const weekPlan = [];
        
        // Add repeat recipes
        if (mix.repeats > 0 && tried.length > 0) {
            const repeatCandidates = tried
                .filter(r => !recentRecipes.slice(-7).includes(r.id))
                .sort((a, b) => {
                    const aFav = userData.isFavorite(a.id) ? 10 : 0;
                    const bFav = userData.isFavorite(b.id) ? 10 : 0;
                    const aMas = userData.isRecipeMastered(a.id) ? 5 : 0;
                    const bMas = userData.isRecipeMastered(b.id) ? 5 : 0;
                    return (bFav + bMas) - (aFav + aMas);
                });
            
            weekPlan.push(...repeatCandidates.slice(0, mix.repeats));
        }
        
        // Add new recipes
        const newNeeded = 7 - weekPlan.length;
        if (newNeeded > 0) {
            const newCandidates = recipes.getPersonalizedRecommendations(prefs, 20)
                .filter(r => !weekPlan.find(p => p.id === r.id))
                .filter(r => !recentRecipes.includes(r.id))
                .filter(r => !excludeIds.has(r.id));
            
            weekPlan.push(...newCandidates.slice(0, newNeeded));
        }
        
        // Fill any remaining slots with available recipes
        while (weekPlan.length < 7 && weekPlan.length < availableRecipes.length) {
            const remaining = availableRecipes.filter(r => 
                !weekPlan.find(p => p.id === r.id) &&
                !excludeIds.has(r.id)
            );
            if (remaining.length > 0) {
                weekPlan.push(remaining[0]);
            } else {
                break;
            }
        }
        
        return weekPlan.slice(0, 7);
    },
    
    // Get week start date (for display)
    getWeekStartDate: function(weekOffset = 0) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        const monday = new Date(today.setDate(diff));
        monday.setDate(monday.getDate() + (weekOffset * 7));
        return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    
    // Render weekly plan page
    renderWeeklyPlan: function(container) {
        // Check if multi-week plan exists
        const multiWeekPlan = userData.getMultiWeekPlan();
        const hasMultiWeek = multiWeekPlan && multiWeekPlan.length > 0;
        
        if (hasMultiWeek) {
            this.renderMultiWeekPlan(container);
            return;
        }
        
        // Get or generate single week plan
        let plan = userData.getWeeklyPlan();
        if (!plan || plan.length === 0) {
            plan = this.generateWeeklyPlan();
        }
        this.currentPlan = plan;
        
        // Get cuisine distribution
        const recipeList = plan.map(p => p.recipe);
        const distribution = recipes.getCuisineDistribution(recipeList);
        
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">📅 Your Weekly Menu</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Personalized for your preferences and equipment</p>

            <div class="grid-2col">
                <!-- Weekly Menu -->
                <div class="card card-light">
                    <h2 style="color: var(--text-primary); margin-bottom: 16px;">This Week's Meals</h2>
                    
                    ${plan.map(day => this.renderDayItem(day)).join('')}
                    
                    <button class="btn btn-primary btn-full" style="margin-top: 16px;" onclick="mealPlan.regenerateWeek()">
                        Regenerate This Week
                    </button>
                    <button class="btn btn-secondary btn-full" style="margin-top: 8px;" onclick="mealPlan.startMultiWeekPlanning()">
                        📅 Plan Multiple Weeks
                    </button>
                </div>

                <!-- Right Column -->
                <div>
                    <!-- Cuisine Distribution -->
                    <div class="card card-main mb-6">
                        <h3 style="margin-bottom: 16px;">🌍 Cuisine Diversity</h3>
                        ${this.renderCuisineDistribution(distribution)}
                    </div>

                    <!-- Shopping List -->
                    <div class="card card-light">
                        <h3 style="color: var(--text-primary); margin-bottom: 16px;">🛒 Smart Shopping List</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 14px;">
                            <strong>💡 Tip:</strong> Check your pantry first - you might have some items from previous recipes!
                        </p>
                        <button class="btn btn-primary btn-full" onclick="shoppingList.generateAndShow()">
                            View Shopping List & Print
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render individual day item
    renderDayItem: function(dayPlan) {
        const { day, dayShort, recipe, status } = dayPlan;
        const household = userData.data.household || 2;
        
        return `
            <div class="menu-item" onclick="app.viewRecipe('${recipe.id}')">
                <div class="menu-header">
                    <span class="badge badge-${status.badge}">${status.label}</span>
                    <span class="menu-day">${dayShort}</span>
                    <span style="color: var(--text-secondary);">•</span>
                    <span class="menu-cuisine">${recipe.cuisine}</span>
                </div>
                <div class="menu-title">${recipe.name}</div>
                <div class="menu-meta">
                    <span>${'⭐'.repeat(recipe.scores.flavor)}</span>
                    <span>🕐 ${recipe.timing.total_time} min</span>
                    <span style="color: var(--text-secondary);">Scaled for ${household}</span>
                </div>
            </div>
        `;
    },
    
    // Render cuisine distribution
    renderCuisineDistribution: function(distribution) {
        return Object.entries(distribution)
            .sort((a, b) => b[1] - a[1]) // Sort by percentage descending
            .map(([cuisine, percentage]) => `
                <div style="color: white; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-weight: 500;">${cuisine}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%;"></div>
                    </div>
                </div>
            `).join('');
    },
    
    // Swap a recipe in the plan
    swapRecipe: function(dayIndex) {
        console.log('🔄 Swapping recipe for day', dayIndex);
        
        const currentRecipe = this.currentPlan[dayIndex].recipe;
        const userPrefs = userData.getPreferences();
        
        // Get alternative recipes (same cuisine or similar)
        const alternatives = recipes.getPersonalizedRecommendations(userPrefs, 10)
            .filter(r => r.id !== currentRecipe.id)
            .filter(r => !this.currentPlan.find(p => p.recipe.id === r.id));
        
        if (alternatives.length > 0) {
            // Pick random alternative
            const newRecipe = alternatives[Math.floor(Math.random() * alternatives.length)];
            this.currentPlan[dayIndex].recipe = newRecipe;
            this.currentPlan[dayIndex].status = this.getRecipeStatus(newRecipe.id);
            
            // Save updated plan
            userData.setWeeklyPlan(this.currentPlan);
            
            // Re-render
            app.showPage('weekly-plan');
            
            console.log('✅ Recipe swapped to:', newRecipe.name);
        } else {
            alert('No alternative recipes found. Try regenerating the entire week!');
        }
    },
    
    // Mark recipe as cooked
    markAsCooked: function(recipeId) {
        userData.markRecipeTried(recipeId);
        
        // Update stats
        const stats = userData.getStats();
        stats.totalCookingSessions++;
        
        // Check if mastered
        if (userData.isRecipeMastered(recipeId)) {
            stats.recipesMastered++;
        }
        
        userData.updateStats(stats);
        
        console.log('✅ Marked as cooked:', recipeId);
    },
    
    // Render multi-week plan
    renderMultiWeekPlan: function(container) {
        const multiWeekPlan = userData.getMultiWeekPlan();
        const currentWeekIndex = userData.getCurrentWeekIndex();
        const currentWeekData = multiWeekPlan[currentWeekIndex];
        
        if (!currentWeekData) {
            // Fallback to single week
            this.currentPlan = this.generateWeeklyPlan();
            return this.renderWeeklyPlan(container);
        }
        
        const plan = currentWeekData.plan;
        const recipeList = plan.map(p => p.recipe);
        const distribution = recipes.getCuisineDistribution(recipeList);
        
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">📅 Multi-Week Meal Plan</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Plan ahead with ${multiWeekPlan.length} weeks of meals</p>

            <!-- Week Navigation -->
            <div class="card card-main mb-6">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button class="btn btn-secondary" onclick="mealPlan.switchWeek(${currentWeekIndex - 1})" ${currentWeekIndex === 0 ? 'disabled' : ''}>
                        ← Previous Week
                    </button>
                    <div style="text-align: center;">
                        <h3 style="margin-bottom: 4px;">Week ${currentWeekData.weekNumber} of ${multiWeekPlan.length}</h3>
                        <p style="opacity: 0.9; font-size: 14px;">Starting ${currentWeekData.startDate}</p>
                    </div>
                    <button class="btn btn-secondary" onclick="mealPlan.switchWeek(${currentWeekIndex + 1})" ${currentWeekIndex >= multiWeekPlan.length - 1 ? 'disabled' : ''}>
                        Next Week →
                    </button>
                </div>
            </div>

            <div class="grid-2col">
                <!-- Weekly Menu -->
                <div class="card card-light">
                    <h2 style="color: var(--text-primary); margin-bottom: 16px;">This Week's Meals</h2>
                    
                    ${plan.map(day => this.renderDayItem(day)).join('')}
                    
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="btn btn-primary btn-full" onclick="mealPlan.regenerateCurrentWeek()">
                            Regenerate This Week
                        </button>
                        <button class="btn btn-secondary" onclick="mealPlan.switchToSingleWeek()">
                            Exit Multi-Week
                        </button>
                    </div>
                </div>

                <!-- Right Column -->
                <div>
                    <!-- Plan More Weeks -->
                    <div class="card card-main mb-6">
                        <h3 style="margin-bottom: 16px;">📅 Plan More Weeks</h3>
                        <p style="opacity: 0.9; margin-bottom: 16px; font-size: 14px;">
                            Currently planning ${multiWeekPlan.length} week${multiWeekPlan.length > 1 ? 's' : ''}
                        </p>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary btn-small btn-full" onclick="mealPlan.generateMultiWeekPlan(2)">
                                2 Weeks
                            </button>
                            <button class="btn btn-secondary btn-small btn-full" onclick="mealPlan.generateMultiWeekPlan(3)">
                                3 Weeks
                            </button>
                            <button class="btn btn-secondary btn-small btn-full" onclick="mealPlan.generateMultiWeekPlan(4)">
                                4 Weeks
                            </button>
                        </div>
                    </div>
                
                    <!-- Cuisine Distribution -->
                    <div class="card card-main mb-6">
                        <h3 style="margin-bottom: 16px;">🌍 This Week's Cuisine Diversity</h3>
                        ${this.renderCuisineDistribution(distribution)}
                    </div>

                    <!-- Shopping List -->
                    <div class="card card-light">
                        <h3 style="color: var(--text-primary); margin-bottom: 16px;">🛒 Shopping List</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 14px;">
                            For Week ${currentWeekData.weekNumber}
                        </p>
                        <button class="btn btn-primary btn-full" onclick="shoppingList.generateAndShow()">
                            View Shopping List
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Switch between weeks
    switchWeek: function(newIndex) {
        const multiWeekPlan = userData.getMultiWeekPlan();
        
        if (newIndex < 0 || newIndex >= multiWeekPlan.length) return;
        
        userData.setCurrentWeekIndex(newIndex);
        app.showPage('weekly-plan');
    },
    
    // Regenerate current week in multi-week plan
    regenerateCurrentWeek: function() {
        if (!confirm('Regenerate just this week?')) return;
        
        const multiWeekPlan = userData.getMultiWeekPlan();
        const currentWeekIndex = userData.getCurrentWeekIndex();
        
        // Generate new week
        const userPrefs = userData.getPreferences();
        const weeklyRecipes = recipes.getWeeklyRecipes(userPrefs);
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekPlan = weeklyRecipes.map((recipe, index) => ({
            day: days[index],
            dayShort: days[index].substring(0, 3),
            recipe: recipe,
            status: this.getRecipeStatus(recipe.id)
        }));
        
        // Update the specific week
        multiWeekPlan[currentWeekIndex].plan = weekPlan;
        userData.setMultiWeekPlan(multiWeekPlan);
        
        app.showPage('weekly-plan');
    },
    
    // Switch back to single week mode
    switchToSingleWeek: function() {
        if (confirm('Exit multi-week planning? Your current week will be saved as the active plan.')) {
            const multiWeekPlan = userData.getMultiWeekPlan();
            const currentWeekIndex = userData.getCurrentWeekIndex();
            
            // Save current week as the single weekly plan
            if (multiWeekPlan[currentWeekIndex]) {
                userData.setWeeklyPlan(multiWeekPlan[currentWeekIndex].plan);
            }
            
            // Clear multi-week plan
            userData.setMultiWeekPlan([]);
            userData.setCurrentWeekIndex(0);
            
            app.showPage('weekly-plan');
        }
    },
    
    // Start multi-week planning
    startMultiWeekPlanning: function() {
        const weeks = prompt('How many weeks would you like to plan? (2-4)', '2');
        const numWeeks = parseInt(weeks);
        
        if (isNaN(numWeeks) || numWeeks < 2 || numWeeks > 4) {
            alert('Please enter a number between 2 and 4');
            return;
        }
        
        this.generateMultiWeekPlan(numWeeks);
        app.showPage('weekly-plan');
    }
};
