/* ===================================
   APP.JS - Main Application Controller
   =================================== */

const app = {
    currentPage: 'home',
    
    // Initialize the app
    init: function() {
        console.log('🍳 Palate App Initializing...');
        
        // Setup navigation
        this.setupNavigation();
        
        // Load user data
        userData.init();
        
        // Load recipes
        recipes.loadRecipes();
        
        // Determine if user is new
        if (userData.isNewUser()) {
            this.showPage('onboarding');
        } else {
            this.showPage('dashboard');
        }
        
        // Setup search
        this.setupSearch();
        
        console.log('✅ Palate App Ready!');
    },
    
    // Setup navigation links
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
    },
    
    // Show a specific page
    showPage: function(pageName) {
        console.log(`📄 Showing page: ${pageName}`);
        
        // Update current page
        this.currentPage = pageName;
        
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
        
        // Clear container
        const container = document.getElementById('app-container');
        container.innerHTML = '';
        
        // Load appropriate page
        switch(pageName) {
            case 'home':
            case 'onboarding':
                onboarding.renderOnboarding(container);
                break;
            case 'dashboard':
                this.renderDashboard(container);
                break;
            case 'weekly-plan':
                mealPlan.renderWeeklyPlan(container);
                break;
            case 'preferences':
                this.renderPreferences(container);
                break;
            case 'recipes':
                this.renderRecipes(container);
                break;
            case 'collections':
                this.renderCollections(container);
                break;
            case 'hacks':
                this.renderKitchenHacks(container);
                break;
            case 'recipe-detail':
                cookingMode.renderRecipeDetail(container, this.currentRecipeId);
                break;
            default:
                container.innerHTML = '<div class="empty-state"><h2>Page not found</h2></div>';
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    },
    
    // Render dashboard (returning users)
    renderDashboard: function(container) {
        const stats = userData.getStats();
        
        container.innerHTML = `
            <div class="dashboard-hero">
                <h1>Welcome back, Chef! 👋</h1>
                <p style="font-size: 18px; opacity: 0.9;">Ready to cook something amazing?</p>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">${stats.recipiesTried}</div>
                        <div class="stat-label">Recipes Tried</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.recipesMastered}</div>
                        <div class="stat-label">Recipes Mastered</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.newThisWeek}</div>
                        <div class="stat-label">New This Week</div>
                    </div>
                </div>
            </div>

            <div class="grid-2col">
                <div class="card card-light">
                    <h2 style="color: var(--text-primary); margin-bottom: 16px;">📅 This Week's Plan</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">You're cooking 7 delicious meals!</p>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="app.showPage('weekly-plan')">View Full Week</button>
                        <button class="btn btn-secondary" onclick="mealPlan.regenerateWeek()">Regenerate</button>
                    </div>
                </div>

                <div class="card card-light">
                    <h2 style="color: var(--text-primary); margin-bottom: 16px;">🛒 Shopping List Ready</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">Optimized to avoid waste</p>
                    <button class="btn btn-primary btn-full" onclick="shoppingList.show()">View Shopping List</button>
                </div>
                
                <div class="card card-light">
                    <h2 style="color: var(--text-primary); margin-bottom: 16px;">🔪 Kitchen Hacks</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">Pro tips & shortcuts for cooking smarter</p>
                    <button class="btn btn-secondary btn-full" onclick="app.showPage('hacks')">Browse Hacks</button>
                </div>
            </div>

            <div class="card card-white" style="margin-top: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: var(--text-primary); margin-bottom: 8px;">Your Cooking Goals</h3>
                        <p style="color: var(--text-secondary);">Life changes? Update your preferences anytime</p>
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="onboarding.reset()">Reset Goals</button>
                </div>
            </div>
            
            <!-- Popular This Week -->
            <div class="card card-main" style="margin-top: 32px;">
                <h3 style="margin-bottom: 16px;">🔥 Popular This Week</h3>
                <p style="opacity: 0.9; margin-bottom: 16px; font-size: 14px;">
                    What other cooks are loving right now
                </p>
                ${this.renderPopularRecipes()}
            </div>
        `;
    },
    
    // Render preferences page
    renderPreferences: function(container) {
        const prefs = userData.getPreferences();
        
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">⚙️ Your Preferences</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Customize your cooking experience</p>

            <!-- Units Toggle -->
            <div class="card card-light mb-8">
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">📏 Measurement Units</h3>
                <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 14px;">Choose your preferred measurement system</p>
                <div style="display: flex; gap: 12px;">
                    <button class="btn ${prefs.units === 'imperial' || !prefs.units ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="app.setUnits('imperial')" style="flex: 1;">
                        🇺🇸 Imperial<br><span style="font-size: 12px; opacity: 0.8;">cups, oz, lb, °F</span>
                    </button>
                    <button class="btn ${prefs.units === 'metric' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="app.setUnits('metric')" style="flex: 1;">
                        🌍 Metric<br><span style="font-size: 12px; opacity: 0.8;">ml, g, kg, °C</span>
                    </button>
                </div>
            </div>

            <!-- Cuisine Preferences -->
            <div class="card card-light mb-8">
                <h3 style="color: var(--text-primary); margin-bottom: 16px;">Cuisine Preferences</h3>
                <p style="color: var(--text-secondary); margin-bottom: 16px;">Select specific regional cuisines you enjoy</p>
                <div class="tag-grid" id="cuisine-tags"></div>
            </div>

            <div class="grid-2col">
                <!-- Priorities -->
                <div class="card card-main">
                    <h3 style="margin-bottom: 16px;">What Matters Most?</h3>
                    <p style="margin-bottom: 24px; opacity: 0.9;">Rate from 1-5 stars (6 if exceptional)</p>
                    
                    <div class="slider-container">
                        <label class="slider-label">Flavor <span id="flavor-stars">⭐⭐⭐⭐⭐</span></label>
                        <div class="slider-wrapper">
                            <input type="range" class="slider" id="flavor-slider" min="0" max="6" value="${prefs.priorities.flavor}">
                            <span class="slider-value" style="color: white;">${prefs.priorities.flavor} stars</span>
                        </div>
                    </div>

                    <div class="slider-container">
                        <label class="slider-label">Nutrition <span id="nutrition-stars">⭐⭐⭐</span></label>
                        <div class="slider-wrapper">
                            <input type="range" class="slider" id="nutrition-slider" min="0" max="6" value="${prefs.priorities.nutrition}">
                            <span class="slider-value" style="color: white;">${prefs.priorities.nutrition} stars</span>
                        </div>
                    </div>

                    <div class="slider-container">
                        <label class="slider-label">Healthiness <span id="healthiness-stars">⭐⭐</span></label>
                        <div class="slider-wrapper">
                            <input type="range" class="slider" id="healthiness-slider" min="0" max="6" value="${prefs.priorities.healthiness}">
                            <span class="slider-value" style="color: white;">${prefs.priorities.healthiness} stars</span>
                        </div>
                    </div>

                    <div class="slider-container" style="margin-bottom: 0;">
                        <label class="slider-label">Difficulty <span id="difficulty-stars">⭐⭐⭐</span></label>
                        <div class="slider-wrapper">
                            <input type="range" class="slider" id="difficulty-slider" min="0" max="6" value="${prefs.priorities.difficulty}">
                            <span class="slider-value" style="color: white;">${prefs.priorities.difficulty} stars</span>
                        </div>
                    </div>
                </div>

                <!-- Time & Skill & Adventure -->
                <div class="card card-main">
                    <h3 style="margin-bottom: 16px;">Cooking Details</h3>
                    
                    <div class="slider-container">
                        <label class="slider-label">Cooking time per meal</label>
                        <div class="slider-wrapper">
                            <input type="range" class="slider" id="time-slider" min="10" max="120" step="5" value="${prefs.cookingTime}">
                            <span class="slider-value" style="color: white;">${prefs.cookingTime} min</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label class="slider-label" style="margin-bottom: 12px;">Skill level</label>
                        <div id="skill-level-buttons" style="display: flex; gap: 8px;"></div>
                    </div>

                    <div style="margin-bottom: 0;">
                        <label class="slider-label" style="margin-bottom: 12px;">How adventurous?</label>
                        <div id="adventure-buttons" style="display: flex; gap: 8px;"></div>
                    </div>
                </div>
            </div>

            <!-- Household & Equipment -->
            <div class="grid-2col mt-8">
                <div class="card card-light">
                    <h3 style="color: var(--text-primary); margin-bottom: 16px;">👥 Household Size</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">Cooking for ${prefs.household} people</p>
                    <div id="household-buttons" style="display: flex; gap: 8px;"></div>
                </div>

                <div class="card card-light">
                    <h3 style="color: var(--text-primary); margin-bottom: 16px;">🍳 Kitchen Equipment</h3>
                    <div class="tag-grid" id="equipment-tags"></div>
                </div>
            </div>

            <div style="margin-top: 32px; text-align: center;">
                <button class="btn btn-primary" onclick="app.savePreferences()">Save Preferences</button>
                <button class="btn btn-secondary" onclick="app.resetPreferences()">Reset to Defaults</button>
            </div>
        `;
        
        // Initialize interactive elements
        this.initPreferencesInteractions();
    },
    
    // Initialize preferences page interactions
    initPreferencesInteractions: function() {
        // Cuisine tags
        const cuisineContainer = document.getElementById('cuisine-tags');
        const cuisines = [
            'Szechuan', 'Shanghainese', 'Cantonese', 'Northern Indian', 'Southern Indian',
            'Thai', 'Vietnamese', 'Egyptian', 'Moroccan', 'Spanish', 'Italian', 'French',
            'Mexican', 'Japanese', 'Korean'
        ];
        
        const prefs = userData.getPreferences();
        cuisines.forEach(cuisine => {
            const tag = document.createElement('button');
            tag.className = 'tag' + (prefs.cuisines.includes(cuisine) ? ' selected' : '');
            tag.textContent = cuisine;
            tag.onclick = () => tag.classList.toggle('selected');
            cuisineContainer.appendChild(tag);
        });
        
        // Equipment tags
        const equipmentContainer = document.getElementById('equipment-tags');
        const equipment = ['Pan', 'Wok', 'Rice Cooker', 'Air Fryer', 'Oven', 'Steamer', 'Pressure Cooker', 'Knife Set'];
        equipment.forEach(item => {
            const tag = document.createElement('button');
            tag.className = 'tag' + (prefs.equipment.includes(item.toLowerCase().replace(/ /g, '-')) ? ' selected' : '');
            tag.textContent = item;
            tag.onclick = () => tag.classList.toggle('selected');
            equipmentContainer.appendChild(tag);
        });
        
        // Sliders
        ['flavor', 'nutrition', 'healthiness', 'difficulty'].forEach(factor => {
            const slider = document.getElementById(`${factor}-slider`);
            slider.addEventListener('input', function() {
                const value = this.value;
                this.nextElementSibling.textContent = value + ' star' + (value !== '1' ? 's' : '');
            });
        });
        
        document.getElementById('time-slider').addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value + ' min';
        });
    },
    
    // Render recipes page
    renderRecipes: function(container) {
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">📖 Recipe Library</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">${recipes.getAllRecipes().length} tested recipes from around the world</p>

            <!-- Import Recipe Button -->
            <div class="card card-main" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin-bottom: 4px;">➕ Import Recipe from URL</h3>
                        <p style="opacity: 0.9; font-size: 14px;">Paste a recipe URL to add it to your library</p>
                    </div>
                    <button class="btn btn-secondary" onclick="app.showRecipeImport()">
                        Import Recipe
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="card card-white mb-8">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: var(--text-primary);">Filter & Sort</h3>
                    <select id="sort-select" onchange="app.handleSort(this.value)" style="padding: 8px 16px; border-radius: var(--radius-pill); border: 2px solid var(--orange-light); background: white; color: var(--text-primary); font-weight: 600;">
                        <option value="personalized">Personalized for You</option>
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest</option>
                        <option value="quickest">Quickest</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Cuisine</h4>
                    <div class="tag-grid" id="cuisine-filter-tags">
                        <button class="tag selected" onclick="app.filterByCuisine(this, 'all')">All Cuisines</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'Szechuan')">Szechuan</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'Thai')">Thai</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'Italian')">Italian</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'Japanese')">Japanese</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'Mexican')">Mexican</button>
                        <button class="tag" onclick="app.filterByCuisine(this, 'French')">French</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Dietary Preferences</h4>
                    <div class="tag-grid" id="dietary-filter-tags">
                        <button class="tag" onclick="app.filterByDiet(this, 'vegetarian')">🥬 Vegetarian</button>
                        <button class="tag" onclick="app.filterByDiet(this, 'vegan')">🌱 Vegan</button>
                        <button class="tag" onclick="app.filterByDiet(this, 'gluten-free')">🌾 Gluten-Free</button>
                        <button class="tag" onclick="app.filterByDiet(this, 'dairy-free')">🥛 Dairy-Free</button>
                        <button class="tag" onclick="app.filterByDiet(this, 'halal')">☪️ Halal</button>
                        <button class="tag" onclick="app.filterByDiet(this, 'kosher')">✡️ Kosher</button>
                        <button class="tag" onclick="app.filterByMealPrep(this)">🍱 Meal Prep Friendly</button>
                    </div>
                </div>
                
                <div>
                    <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Quick Filters</h4>
                    <div class="tag-grid">
                        <button class="tag" onclick="app.filterByTime(this, 30)">⏱️ Under 30 min</button>
                        <button class="tag" onclick="app.filterByDifficulty(this, 'beginner')">👶 Beginner Friendly</button>
                        <button class="tag" onclick="app.clearAllFilters()">🔄 Clear All Filters</button>
                    </div>
                </div>
            </div>

            <!-- Recipe Grid -->
            <div class="grid-3col" id="recipes-grid"></div>
        `;
        
        // Load recipes into grid
        this.loadRecipeGrid();
    },
    
    // Load recipe grid
    loadRecipeGrid: function() {
        const grid = document.getElementById('recipes-grid');
        const allRecipes = recipes.getAllRecipes();
        
        grid.innerHTML = allRecipes.map(recipe => `
            <div class="recipe-card" onclick="app.viewRecipe('${recipe.id}')">
                <span class="badge badge-cuisine">${recipe.cuisine}</span>
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-meta">
                    <div style="color: var(--text-primary); font-size: 14px;">🕐 ${recipe.timing.total_time} min</div>
                    <div style="color: var(--text-primary); font-size: 14px;">👨‍🍳 ${recipe.difficulty}</div>
                </div>

                <div class="recipe-scores mb-4">
                    <div class="scores-title">Scores</div>
                    <div class="rating-grid">
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Flavor</span>
                            <span>${'⭐'.repeat(recipe.scores.flavor)}</span>
                        </div>
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Nutrition</span>
                            <span>${'⭐'.repeat(recipe.scores.nutrition)}</span>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-full">View Recipe</button>
            </div>
        `).join('');
    },
    
    // View a specific recipe
    viewRecipe: function(recipeId) {
        this.currentRecipeId = recipeId;
        this.showPage('recipe-detail');
    },
    
    // Setup search functionality
    setupSearch: function() {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                this.performSearch(query);
            }
        });
    },
    
    // Perform search
    performSearch: function(query) {
        console.log('🔍 Searching for:', query);
        const results = recipes.search(query);
        console.log('Found', results.length, 'recipes');
        
        // If on recipes page, update the grid
        if (this.currentPage === 'recipes') {
            this.displaySearchResults(results, query);
        }
    },
    
    // Display search results
    displaySearchResults: function(results, query) {
        const grid = document.getElementById('recipes-grid');
        
        if (results.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
                    <div class="empty-state-icon">🔍</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">No recipes found for "${query}"</h3>
                    <p style="color: var(--text-secondary);">Try a different search term or browse all recipes</p>
                    <button class="btn btn-secondary" onclick="document.getElementById('search-input').value = ''; app.loadRecipeGrid();" style="margin-top: 16px;">
                        Clear Search
                    </button>
                </div>
            `;
            return;
        }
        
        // Show results with count
        const resultsHeader = document.createElement('div');
        resultsHeader.style.cssText = 'grid-column: 1 / -1; margin-bottom: 16px;';
        resultsHeader.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p style="color: var(--text-secondary); font-size: 16px;">
                    Found <strong style="color: var(--text-primary);">${results.length}</strong> recipe${results.length !== 1 ? 's' : ''} matching "${query}"
                </p>
                <button class="btn btn-secondary btn-small" onclick="document.getElementById('search-input').value = ''; app.loadRecipeGrid();">
                    Clear Search
                </button>
            </div>
        `;
        
        grid.innerHTML = '';
        grid.appendChild(resultsHeader);
        
        // Display results
        results.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.onclick = () => app.viewRecipe(recipe.id);
            card.innerHTML = `
                <span class="badge badge-cuisine">${recipe.cuisine}</span>
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-meta">
                    <div style="color: var(--text-primary); font-size: 14px;">🕐 ${recipe.timing.total_time} min</div>
                    <div style="color: var(--text-primary); font-size: 14px;">👨‍🍳 ${recipe.difficulty}</div>
                </div>

                <div class="recipe-scores mb-4">
                    <div class="scores-title">Scores</div>
                    <div class="rating-grid">
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Flavor</span>
                            <span>${'⭐'.repeat(recipe.scores.flavor)}</span>
                        </div>
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Nutrition</span>
                            <span>${'⭐'.repeat(recipe.scores.nutrition)}</span>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-full">View Recipe</button>
            `;
            grid.appendChild(card);
        });
    },
    
    // Save preferences
    savePreferences: function() {
        // Collect all preferences from UI
        const newPrefs = {
            cuisines: Array.from(document.querySelectorAll('#cuisine-tags .tag.selected')).map(t => t.textContent),
            equipment: Array.from(document.querySelectorAll('#equipment-tags .tag.selected')).map(t => t.textContent.toLowerCase().replace(/ /g, '-')),
            priorities: {
                flavor: parseInt(document.getElementById('flavor-slider').value),
                nutrition: parseInt(document.getElementById('nutrition-slider').value),
                healthiness: parseInt(document.getElementById('healthiness-slider').value),
                difficulty: parseInt(document.getElementById('difficulty-slider').value)
            },
            cookingTime: parseInt(document.getElementById('time-slider').value)
        };
        
        userData.updatePreferences(newPrefs);
        alert('✅ Preferences saved!');
    },
    
    // Reset preferences
    resetPreferences: function() {
        if (confirm('Reset all preferences to defaults?')) {
            userData.resetPreferences();
            this.showPage('preferences');
        }
    },
    
    // Filter by cuisine
    filterByCuisine: function(button, cuisine) {
        // Update button states
        document.querySelectorAll('#cuisine-filter-tags .tag').forEach(tag => {
            tag.classList.remove('selected');
        });
        button.classList.add('selected');
        
        // Filter recipes
        let filtered;
        if (cuisine === 'all') {
            filtered = recipes.getAllRecipes();
        } else {
            filtered = recipes.filterByCuisine(cuisine);
        }
        
        this.displayFilteredRecipes(filtered, `${cuisine} Cuisine`);
    },
    
    // Filter by dietary preference
    filterByDiet: function(button, diet) {
        button.classList.toggle('selected');
        
        // Get all selected dietary filters
        const selectedDiets = Array.from(document.querySelectorAll('#dietary-filter-tags .tag.selected'))
            .map(tag => tag.onclick.toString().match(/'([^']+)'/)[1]);
        
        if (selectedDiets.length === 0) {
            // No dietary filters, show all
            this.loadRecipeGrid();
            return;
        }
        
        // Filter recipes that match ALL selected dietary tags
        const filtered = recipes.getAllRecipes().filter(recipe => {
            return selectedDiets.every(diet => 
                recipe.dietary_tags.some(tag => tag.includes(diet))
            );
        });
        
        this.displayFilteredRecipes(filtered, `Dietary: ${selectedDiets.join(', ')}`);
    },
    
    // Filter by cooking time
    filterByTime: function(button, maxMinutes) {
        button.classList.toggle('selected');
        
        if (!button.classList.contains('selected')) {
            this.loadRecipeGrid();
            return;
        }
        
        const filtered = recipes.filterByTime(maxMinutes);
        this.displayFilteredRecipes(filtered, `Under ${maxMinutes} minutes`);
    },
    
    // Filter by difficulty
    filterByDifficulty: function(button, difficulty) {
        button.classList.toggle('selected');
        
        if (!button.classList.contains('selected')) {
            this.loadRecipeGrid();
            return;
        }
        
        const filtered = recipes.filterByDifficulty(difficulty);
        this.displayFilteredRecipes(filtered, `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`);
    },
    
    // Filter by meal prep
    filterByMealPrep: function(button) {
        // Toggle active state
        button.classList.toggle('active');
        
        const allRecipes = recipes.getAllRecipes();
        const filtered = allRecipes.filter(recipe => recipe.meal_prep_friendly === true);
        
        this.displayFilteredRecipes(filtered, 'Meal Prep Friendly');
    },
    
    // Clear all filters
    clearAllFilters: function() {
        // Reset all filter buttons
        document.querySelectorAll('.tag.selected').forEach(tag => {
            if (!tag.textContent.includes('All Cuisines')) {
                tag.classList.remove('selected');
            }
        });
        
        // Reset to "All Cuisines"
        const allCuisinesBtn = document.querySelector('#cuisine-filter-tags .tag');
        if (allCuisinesBtn) allCuisinesBtn.classList.add('selected');
        
        // Clear search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        // Reload all recipes
        this.loadRecipeGrid();
    },
    
    // Display filtered recipes
    displayFilteredRecipes: function(filtered, filterName) {
        const grid = document.getElementById('recipes-grid');
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
                    <div class="empty-state-icon">🔍</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">No recipes found</h3>
                    <p style="color: var(--text-secondary);">No recipes match the selected filters</p>
                    <button class="btn btn-secondary" onclick="app.clearAllFilters()" style="margin-top: 16px;">
                        Clear Filters
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filtered.map(recipe => `
            <div class="recipe-card" onclick="app.viewRecipe('${recipe.id}')">
                <span class="badge badge-cuisine">${recipe.cuisine}</span>
                ${this.renderDietaryBadges(recipe)}
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-meta">
                    <div style="color: var(--text-primary); font-size: 14px;">🕐 ${recipe.timing.total_time} min</div>
                    <div style="color: var(--text-primary); font-size: 14px;">👨‍🍳 ${recipe.difficulty}</div>
                </div>

                <div class="recipe-scores mb-4">
                    <div class="scores-title">Scores</div>
                    <div class="rating-grid">
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Flavor</span>
                            <span>${'⭐'.repeat(recipe.scores.flavor)}</span>
                        </div>
                        <div class="rating-item">
                            <span style="color: var(--text-primary)">Nutrition</span>
                            <span>${'⭐'.repeat(recipe.scores.nutrition)}</span>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-full">View Recipe</button>
            </div>
        `).join('');
    },
    
    // Render dietary badges for recipe cards
    renderDietaryBadges: function(recipe) {
        const badges = [];
        
        if (recipe.dietary_tags.includes('vegetarian')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">🥬 Veg</span>');
        }
        if (recipe.dietary_tags.includes('vegan')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">🌱 Vegan</span>');
        }
        if (recipe.dietary_tags.some(tag => tag.includes('gluten-free'))) {
            badges.push('<span class="badge" style="background: #FEF3C7; border-color: #F59E0B; color: #92400E; margin-left: 4px;">🌾 GF</span>');
        }
        if (recipe.dietary_tags.includes('dairy-free')) {
            badges.push('<span class="badge" style="background: #E0F2FE; border-color: #0EA5E9; color: #0369A1; margin-left: 4px;">🥛 DF</span>');
        }
        if (recipe.dietary_tags.includes('halal')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">☪️ Halal</span>');
        }
        if (recipe.dietary_tags.includes('kosher')) {
            badges.push('<span class="badge" style="background: #DBEAFE; border-color: #3B82F6; color: #1E40AF; margin-left: 4px;">✡️ Kosher</span>');
        }
        if (recipe.meal_prep_friendly) {
            badges.push('<span class="badge" style="background: #F3E8FF; border-color: #A855F7; color: #6B21A8; margin-left: 4px;">🍱 Meal Prep</span>');
        }
        
        return badges.join('');
    },
    
    // Handle sort selection
    handleSort: function(sortType) {
        let sorted;
        const allRecipes = recipes.getAllRecipes();
        
        switch(sortType) {
            case 'personalized':
                sorted = recipes.getPersonalizedRecommendations(userData.getPreferences(), 30);
                break;
            case 'popular':
                sorted = recipes.getPopularRecipes(30);
                break;
            case 'newest':
                sorted = [...allRecipes].reverse(); // Newest last in array
                break;
            case 'quickest':
                sorted = recipes.getQuickestRecipes(30);
                break;
            default:
                sorted = allRecipes;
        }
        
        this.displayFilteredRecipes(sorted, sortType);
    },
    
    // Render popular recipes for dashboard
    renderPopularRecipes: function() {
        const popular = recipes.getPopularThisWeek(5);
        
        return popular.map((recipe, index) => `
            <div style="
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s;
            " onclick="app.viewRecipe('${recipe.id}')" onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <span style="font-size: 18px; font-weight: 700; opacity: 0.7;">#${index + 1}</span>
                        <span style="font-weight: 600; margin-left: 12px;">${recipe.name}</span>
                    </div>
                    <span style="font-size: 12px; opacity: 0.8;">${recipe.cuisine}</span>
                </div>
                <div style="display: flex; gap: 16px; font-size: 13px; opacity: 0.9;">
                    <span>⏱️ ${recipe.timing.total_time} min</span>
                    <span>${'⭐'.repeat(recipe.scores.flavor)}</span>
                    <span style="margin-left: auto;">❤️ ${recipe.user_stats.likes} likes</span>
                </div>
            </div>
        `).join('');
    },
    
    // Show recipe import modal
    showRecipeImport: function() {
        const modal = document.createElement('div');
        modal.id = 'recipe-import-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                padding: 32px;
                position: relative;
            ">
                <button onclick="document.getElementById('recipe-import-modal').remove()" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: var(--orange-lightest);
                    border: 2px solid var(--orange-main);
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    cursor: pointer;
                    font-size: 20px;
                ">×</button>
                
                <h2 style="color: var(--text-primary); margin-bottom: 8px;">➕ Import Recipe</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">
                    Paste a recipe URL from popular recipe sites. We'll extract the recipe data and add it to your library.
                </p>
                
                <div style="
                    background: #FEF3C7;
                    border: 2px solid #F59E0B;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 24px;
                    font-size: 13px;
                    color: #92400E;
                ">
                    <strong>⚠️ Note:</strong> This feature requires manual review. After import, you'll need to verify and adjust the recipe data.
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                        Recipe URL
                    </label>
                    <input type="url" id="recipe-url-input" placeholder="https://example.com/recipe/amazing-pasta" style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid var(--orange-light);
                        border-radius: 8px;
                        font-size: 14px;
                    ">
                </div>
                
                <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px;">
                    <strong>Supported sites:</strong> AllRecipes, Serious Eats, NYT Cooking, Bon Appétit, and most recipe blogs with structured data
                </p>
                
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-primary btn-full" onclick="app.importRecipeFromURL()">
                        Import Recipe
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('recipe-import-modal').remove()">
                        Cancel
                    </button>
                </div>
                
                <div id="import-status" style="margin-top: 16px; text-align: center;"></div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    },
    
    // Import recipe from URL (with Netlify Function)
    importRecipeFromURL: async function() {
        const urlInput = document.getElementById('recipe-url-input');
        const url = urlInput.value.trim();
        const statusDiv = document.getElementById('import-status');
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }
        
        statusDiv.innerHTML = '<div class="spinner"></div><p style="color: var(--text-secondary); margin-top: 8px;">Fetching recipe data...</p>';
        
        try {
            // Call Netlify Function
            const response = await fetch('/.netlify/functions/import-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to import recipe');
            }
            
            // Success! Show preview
            statusDiv.innerHTML = `
                <div style="
                    background: #D1FAE5;
                    border: 2px solid #10B981;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: left;
                    margin-bottom: 16px;
                ">
                    <p style="color: #065F46; font-weight: 600; margin-bottom: 8px;">
                        ✅ Recipe Imported Successfully!
                    </p>
                    <p style="color: #065F46; font-size: 14px; margin-bottom: 4px;">
                        <strong>${data.name}</strong>
                    </p>
                    <p style="color: #065F46; font-size: 13px;">
                        ${data.cuisine} • ${data.timing.total_time} min • ${data.ingredients.length} ingredients
                    </p>
                </div>
                <div style="text-align: left; margin-bottom: 16px;">
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                        Review the recipe data below and click "Add to Library" when ready:
                    </p>
                    <textarea id="recipe-json-preview" readonly style="
                        width: 100%;
                        height: 200px;
                        font-family: monospace;
                        font-size: 11px;
                        padding: 8px;
                        border: 2px solid var(--orange-light);
                        border-radius: 8px;
                        resize: vertical;
                    ">${JSON.stringify(data, null, 2)}</textarea>
                </div>
                <button class="btn btn-primary btn-full" onclick="app.addImportedRecipe()">
                    ➕ Add to My Library
                </button>
            `;
            
            // Store the imported recipe temporarily
            this.importedRecipe = data;
            
        } catch (error) {
            console.error('Import error:', error);
            statusDiv.innerHTML = `
                <div style="
                    background: #FEF2F2;
                    border: 2px solid #EF4444;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: left;
                ">
                    <p style="color: #991B1B; font-weight: 600; margin-bottom: 8px;">
                        ❌ Import Failed
                    </p>
                    <p style="color: #991B1B; font-size: 13px; margin-bottom: 12px;">
                        ${error.message}
                    </p>
                    <p style="color: #991B1B; font-size: 12px;">
                        This site might not support automatic import. Try a popular recipe site like AllRecipes, NYT Cooking, or Serious Eats.
                    </p>
                </div>
            `;
        }
    },
    
    // Add imported recipe to library
    addImportedRecipe: function() {
        if (!this.importedRecipe) {
            alert('No recipe to add');
            return;
        }
        
        // In a real app, this would save to database
        // For now, we'll just add it to the in-memory array
        recipes.allRecipes.push(this.importedRecipe);
        
        alert(`✅ "${this.importedRecipe.name}" added to your library!\n\nNote: This recipe is only stored in your current session. To make it permanent, add it to data/recipes.json`);
        
        // Close modal
        const modal = document.getElementById('recipe-import-modal');
        if (modal) modal.remove();
        
        // Refresh recipes page
        this.showPage('recipes');
        
        // Clear imported recipe
        this.importedRecipe = null;
    },
    
    // Set units preference
    setUnits: function(units) {
        userData.setUnits(units);
        this.showPage('preferences');
    },
    
    // Render collections page
    renderCollections: function(container) {
        const collections = userData.getCollections();
        
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">📚 My Collections</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Organize your favorite recipes</p>

            <div class="card card-main mb-6">
                <button class="btn btn-primary btn-full" onclick="app.showCreateCollectionModal()">
                    ➕ Create New Collection
                </button>
            </div>

            ${collections.length === 0 ? `
                <div class="card card-light" style="text-align: center; padding: 48px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📁</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">No Collections Yet</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">
                        Create collections to organize recipes by theme, occasion, or preference
                    </p>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                        Ideas: "Quick Weeknight", "Date Night", "Meal Prep Sunday", "Kids Love These"
                    </p>
                </div>
            ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                    ${collections.map(collection => this.renderCollectionCard(collection)).join('')}
                </div>
            `}
        `;
    },
    
    // Render collection card
    renderCollectionCard: function(collection) {
        const recipeCount = collection.recipeIds.length;
        
        return `
            <div class="card card-white" style="cursor: pointer; transition: transform 0.2s;" 
                onclick="app.viewCollection('${collection.id}')"
                onmouseover="this.style.transform='translateY(-4px)'"
                onmouseout="this.style.transform='translateY(0)'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div style="font-size: 48px;">${collection.icon}</div>
                    <button onclick="event.stopPropagation(); app.editCollection('${collection.id}')" 
                        style="background: transparent; border: none; cursor: pointer; font-size: 20px; color: var(--text-secondary);">
                        ⋯
                    </button>
                </div>
                
                <h3 style="color: var(--text-primary); margin-bottom: 8px; font-size: 20px;">
                    ${collection.name}
                </h3>
                
                <p style="color: var(--text-secondary); font-size: 14px;">
                    ${recipeCount} ${recipeCount === 1 ? 'recipe' : 'recipes'}
                </p>
            </div>
        `;
    },
    
    // Show create collection modal
    showCreateCollectionModal: function() {
        const modal = document.createElement('div');
        modal.id = 'create-collection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const icons = ['📁', '❤️', '⭐', '🍕', '🥗', '🍜', '🍰', '☕', '🎉', '👨‍👩‍👧‍👦', '⚡', '🌱'];
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; max-width: 500px; width: 90%; padding: 32px; position: relative;">
                <button onclick="document.getElementById('create-collection-modal').remove()" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: var(--orange-lightest);
                    border: 2px solid var(--orange-main);
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    cursor: pointer;
                    font-size: 20px;
                ">×</button>
                
                <h2 style="color: var(--text-primary); margin-bottom: 24px;">Create Collection</h2>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                        Collection Name
                    </label>
                    <input type="text" id="collection-name-input" placeholder="e.g., Date Night Dinners" 
                        maxlength="30"
                        style="width: 100%; padding: 12px; border: 2px solid var(--orange-light); border-radius: 8px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                        Choose Icon
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
                        ${icons.map((icon, i) => `
                            <button class="icon-picker-btn ${i === 0 ? 'selected' : ''}" data-icon="${icon}"
                                onclick="app.selectCollectionIcon(this)" 
                                style="
                                    font-size: 32px;
                                    padding: 12px;
                                    border: 2px solid var(--orange-light);
                                    border-radius: 8px;
                                    background: white;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                ">
                                ${icon}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <button class="btn btn-primary btn-full" onclick="app.createCollectionFromModal()">
                    Create Collection
                </button>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
        document.getElementById('collection-name-input').focus();
    },
    
    // Select collection icon
    selectCollectionIcon: function(button) {
        document.querySelectorAll('.icon-picker-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.background = 'white';
            btn.style.borderColor = 'var(--orange-light)';
        });
        button.classList.add('selected');
        button.style.background = 'var(--orange-lightest)';
        button.style.borderColor = 'var(--orange-main)';
    },
    
    // Create collection from modal
    createCollectionFromModal: function() {
        const nameInput = document.getElementById('collection-name-input');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Please enter a collection name');
            return;
        }
        
        const selectedIcon = document.querySelector('.icon-picker-btn.selected');
        const icon = selectedIcon ? selectedIcon.getAttribute('data-icon') : '📁';
        
        userData.createCollection(name, icon);
        
        document.getElementById('create-collection-modal').remove();
        this.showPage('collections');
    },
    
    // View collection
    viewCollection: function(collectionId) {
        const collections = userData.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        
        if (!collection) return;
        
        const recipeIds = collection.recipeIds;
        const collectionRecipes = recipeIds.map(id => recipes.getRecipeById(id)).filter(r => r);
        
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <button class="btn btn-secondary btn-small" onclick="app.showPage('collections')">
                    ← Back to Collections
                </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
                <div style="font-size: 64px;">${collection.icon}</div>
                <div>
                    <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                        ${collection.name}
                    </h1>
                    <p style="font-size: 18px; color: var(--text-secondary);">
                        ${collectionRecipes.length} ${collectionRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                </div>
            </div>
            
            ${collectionRecipes.length === 0 ? `
                <div class="card card-light" style="text-align: center; padding: 48px;">
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">No Recipes Yet</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">
                        Add recipes to this collection from the recipe detail page
                    </p>
                    <button class="btn btn-primary" onclick="app.showPage('recipes')">
                        Browse Recipes
                    </button>
                </div>
            ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                    ${collectionRecipes.map(recipe => this.renderRecipeCard(recipe)).join('')}
                </div>
            `}
        `;
    },
    
    // Edit collection (delete option)
    editCollection: function(collectionId) {
        const collections = userData.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        
        if (!collection) return;
        
        if (confirm(`Delete "${collection.name}" collection?\n\nRecipes won't be deleted, just removed from this collection.`)) {
            userData.deleteCollection(collectionId);
            this.showPage('collections');
        }
    },
    
    // Render Kitchen Hacks page
    renderKitchenHacks: function(container) {
        const categories = kitchenHacks.getCategories();
        const selectedCategory = this.hackCategory || 'all';
        
        const hacksToShow = selectedCategory === 'all' 
            ? kitchenHacks.hacks 
            : kitchenHacks.getByCategory(selectedCategory);
        
        container.innerHTML = `
            <h1 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">🔪 Kitchen Hacks</h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Pro tips & shortcuts for smarter cooking</p>

            <!-- Search -->
            <div class="card card-light mb-6">
                <input type="text" id="hack-search" placeholder="Search hacks..." 
                    onkeyup="app.searchHacks(this.value)"
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid var(--orange-light);
                        border-radius: 8px;
                        font-size: 16px;
                    ">
            </div>

            <!-- Category Filters -->
            <div class="card card-light mb-6">
                <div class="tag-grid">
                    <button class="tag ${selectedCategory === 'all' ? 'active' : ''}" 
                        onclick="app.filterHacksByCategory('all')">
                        All Hacks
                    </button>
                    ${categories.map(cat => `
                        <button class="tag ${selectedCategory === cat ? 'active' : ''}" 
                            onclick="app.filterHacksByCategory('${cat}')">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Hacks List -->
            <div id="hacks-list">
                ${hacksToShow.map(hack => this.renderHackCard(hack)).join('')}
            </div>

            ${hacksToShow.length === 0 ? `
                <div class="card card-light" style="text-align: center; padding: 48px;">
                    <h3 style="color: var(--text-primary);">No hacks found</h3>
                    <p style="color: var(--text-secondary);">Try a different search or category</p>
                </div>
            ` : ''}
        `;
    },
    
    // Render hack card
    renderHackCard: function(hack) {
        return `
            <div class="card card-white" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600;">
                        ${hack.title}
                    </h3>
                    <span class="badge" style="background: var(--orange-lightest); border-color: var(--orange-main); color: var(--orange-dark); font-size: 11px;">
                        ${hack.difficulty}
                    </span>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">
                        <strong>Problem:</strong> ${hack.problem}
                    </div>
                    <div style="font-size: 14px; color: var(--text-primary); background: var(--orange-lightest); padding: 12px; border-radius: 8px; border-left: 4px solid var(--orange-main);">
                        <strong>💡 Solution:</strong> ${hack.solution}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-secondary);">
                    <span>${hack.category}</span>
                    ${hack.timeSaved > 0 ? `<span>⏱️ Saves ~${Math.round(hack.timeSaved / 60)} min</span>` : ''}
                </div>
            </div>
        `;
    },
    
    // Filter hacks by category
    filterHacksByCategory: function(category) {
        this.hackCategory = category;
        this.showPage('hacks');
    },
    
    // Search hacks
    searchHacks: function(query) {
        const results = query.trim() === '' 
            ? kitchenHacks.hacks 
            : kitchenHacks.search(query);
        
        const container = document.getElementById('hacks-list');
        container.innerHTML = results.map(hack => this.renderHackCard(hack)).join('');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="card card-light" style="text-align: center; padding: 48px;">
                    <h3 style="color: var(--text-primary);">No hacks found</h3>
                    <p style="color: var(--text-secondary);">Try a different search term</p>
                </div>
            `;
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch((error) => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
});
