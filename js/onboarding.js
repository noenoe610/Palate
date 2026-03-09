/* ===================================
   ONBOARDING.JS - User Onboarding Flow
   =================================== */

const onboarding = {
    currentStep: 1,
    totalSteps: 5,
    
    // Collected data during onboarding
    collectedData: {
        goal: null,
        household: null,
        leftovers: null,
        adventure: null
    },
    
    // Render onboarding page
    renderOnboarding: function(container) {
        container.innerHTML = `
            <div class="onboarding">
                <h1>Welcome to Palate! 🍳</h1>
                <p>Let's personalize your cooking experience in just a few questions</p>
                
                <div id="onboarding-steps"></div>
            </div>
        `;
        
        this.showStep(1);
    },
    
    // Show specific step
    showStep: function(stepNum) {
        this.currentStep = stepNum;
        const stepsContainer = document.getElementById('onboarding-steps');
        
        // Hide all steps
        const allSteps = stepsContainer.querySelectorAll('.question-card');
        allSteps.forEach(step => step.classList.add('hidden'));
        
        // Show current step or create it if it doesn't exist
        let stepElement = document.getElementById(`step-${stepNum}`);
        if (!stepElement) {
            stepElement = this.createStep(stepNum);
            stepsContainer.appendChild(stepElement);
        }
        
        stepElement.classList.remove('hidden');
    },
    
    // Create a step element
    createStep: function(stepNum) {
        const div = document.createElement('div');
        div.id = `step-${stepNum}`;
        div.className = 'question-card';
        
        switch(stepNum) {
            case 1:
                div.innerHTML = this.getStep1HTML();
                break;
            case 2:
                div.innerHTML = this.getStep2HTML();
                break;
            case 3:
                div.innerHTML = this.getStep3HTML();
                break;
            case 4:
                div.innerHTML = this.getStep4HTML();
                break;
            case 5:
                div.innerHTML = this.getStep5HTML();
                break;
        }
        
        // Add event listeners
        this.attachStepListeners(div, stepNum);
        
        return div;
    },
    
    // Step 1: Main Goal
    getStep1HTML: function() {
        return `
            <h2>What's your main cooking goal?</h2>
            <div class="option-grid">
                <div class="option-card" data-value="delicious">
                    <div class="icon">😋</div>
                    <div class="title">Find Delicious Recipes</div>
                    <div class="description">Prioritize incredible flavors and taste</div>
                </div>
                <div class="option-card" data-value="healthy">
                    <div class="icon">🥗</div>
                    <div class="title">Eat Healthier</div>
                    <div class="description">More variety, balanced nutrition</div>
                </div>
                <div class="option-card" data-value="fitness">
                    <div class="icon">💪</div>
                    <div class="title">Support Fitness Goals</div>
                    <div class="description">Build muscle, fuel workouts</div>
                </div>
                <div class="option-card" data-value="time">
                    <div class="icon">⏱️</div>
                    <div class="title">Save Time</div>
                    <div class="description">Quick, easy weeknight meals</div>
                </div>
                <div class="option-card" data-value="learn">
                    <div class="icon">👨‍🍳</div>
                    <div class="title">Learn Cooking Skills</div>
                    <div class="description">Build confidence in the kitchen</div>
                </div>
                <div class="option-card" data-value="budget">
                    <div class="icon">💰</div>
                    <div class="title">Cook on a Budget</div>
                    <div class="description">Affordable, minimal waste</div>
                </div>
            </div>
        `;
    },
    
    // Step 2: Household Size
    getStep2HTML: function() {
        return `
            <h2>Who are you cooking for?</h2>
            <div class="option-grid">
                <div class="option-card" data-value="1">
                    <div class="icon">🧑</div>
                    <div class="title">Just Me</div>
                    <div class="description">1 person</div>
                </div>
                <div class="option-card" data-value="2">
                    <div class="icon">👫</div>
                    <div class="title">Me & Partner</div>
                    <div class="description">2 people</div>
                </div>
                <div class="option-card" data-value="3-4">
                    <div class="icon">👨‍👩‍👧</div>
                    <div class="title">Small Family</div>
                    <div class="description">3-4 people</div>
                </div>
                <div class="option-card" data-value="5+">
                    <div class="icon">👨‍👩‍👧‍👦</div>
                    <div class="title">Large Family</div>
                    <div class="description">5+ people</div>
                </div>
            </div>
        `;
    },
    
    // Step 3: Leftovers (only shown for 1-2 people)
    getStep3HTML: function() {
        return `
            <h2>How do you feel about leftovers?</h2>
            <div class="option-grid">
                <div class="option-card" data-value="yes">
                    <div class="icon">📦</div>
                    <div class="title">Love Leftovers</div>
                    <div class="description">Cook once, eat 2-3 times</div>
                </div>
                <div class="option-card" data-value="no">
                    <div class="icon">✨</div>
                    <div class="title">Fresh Every Time</div>
                    <div class="description">Cook fresh meals daily</div>
                </div>
            </div>
        `;
    },
    
    // Step 4: Adventure Level
    getStep4HTML: function() {
        return `
            <h2>How adventurous do you want to be?</h2>
            <div class="option-grid">
                <div class="option-card" data-value="comfort">
                    <div class="icon">🏠</div>
                    <div class="title">Comfort Zone</div>
                    <div class="description">Mostly familiar, occasional new recipes</div>
                </div>
                <div class="option-card" data-value="balanced">
                    <div class="icon">⚖️</div>
                    <div class="title">Balanced</div>
                    <div class="description">Mix of familiar and new each week</div>
                </div>
                <div class="option-card" data-value="explorer">
                    <div class="icon">🗺️</div>
                    <div class="title">Explorer</div>
                    <div class="description">Lots of variety, try new things</div>
                </div>
            </div>
        `;
    },
    
    // Step 5: Summary
    getStep5HTML: function() {
        const summary = this.generateSummary();
        return `
            <h2>Here's what we've set up for you</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 16px;">
                You can adjust any of these in Preferences anytime!
            </p>
            
            <div class="pref-summary">
                ${summary}
            </div>

            <button class="btn btn-primary btn-full" style="margin-top: 24px;" onclick="onboarding.complete()">
                Generate My First Week! 🎉
            </button>
        `;
    },
    
    // Generate summary HTML
    generateSummary: function() {
        const goalLabels = {
            'delicious': 'Find Delicious Recipes',
            'healthy': 'Eat Healthier',
            'fitness': 'Support Fitness Goals',
            'time': 'Save Time',
            'learn': 'Learn Cooking Skills',
            'budget': 'Cook on a Budget'
        };
        
        const householdLabels = {
            '1': '1 person',
            '2': '2 people',
            '3-4': '3-4 people',
            '5+': '5+ people'
        };
        
        const adventureLabels = {
            'comfort': 'Comfort Zone',
            'balanced': 'Balanced',
            'explorer': 'Explorer'
        };
        
        let html = `
            <div class="pref-row">
                <span class="pref-label">Main Goal</span>
                <span class="pref-value">${goalLabels[this.collectedData.goal]}</span>
            </div>
            <div class="pref-row">
                <span class="pref-label">Cooking For</span>
                <span class="pref-value">${householdLabels[this.collectedData.household]}</span>
            </div>
        `;
        
        if (this.collectedData.leftovers !== null) {
            html += `
                <div class="pref-row">
                    <span class="pref-label">Leftovers</span>
                    <span class="pref-value">${this.collectedData.leftovers === 'yes' ? 'Love them' : 'Fresh meals'}</span>
                </div>
            `;
        }
        
        html += `
            <div class="pref-row">
                <span class="pref-label">Adventure Level</span>
                <span class="pref-value">${adventureLabels[this.collectedData.adventure]}</span>
            </div>
        `;
        
        // Add suggested defaults based on goal
        const defaults = this.getSuggestedDefaults(this.collectedData.goal);
        html += `
            <div class="pref-row">
                <span class="pref-label">Flavor Priority</span>
                <span class="pref-value">${defaults.flavor} stars</span>
            </div>
            <div class="pref-row">
                <span class="pref-label">Cooking Time</span>
                <span class="pref-value">Up to ${defaults.time} minutes</span>
            </div>
        `;
        
        return html;
    },
    
    // Get suggested defaults based on goal
    getSuggestedDefaults: function(goal) {
        const defaults = {
            'delicious': { flavor: 5, nutrition: 3, healthiness: 2, time: 45, skillLevel: 'intermediate' },
            'healthy': { flavor: 3, nutrition: 5, healthiness: 5, time: 35, skillLevel: 'beginner' },
            'fitness': { flavor: 3, nutrition: 5, healthiness: 5, time: 40, skillLevel: 'intermediate' },
            'time': { flavor: 4, nutrition: 3, healthiness: 3, time: 20, skillLevel: 'beginner' },
            'learn': { flavor: 4, nutrition: 4, healthiness: 3, time: 50, skillLevel: 'beginner' },
            'budget': { flavor: 4, nutrition: 4, healthiness: 3, time: 30, skillLevel: 'beginner' }
        };
        
        return defaults[goal] || defaults['delicious'];
    },
    
    // Attach event listeners to step
    attachStepListeners: function(stepElement, stepNum) {
        if (stepNum === 5) return; // No options in summary step
        
        const options = stepElement.querySelectorAll('.option-card');
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(option, stepNum);
            });
        });
    },
    
    // Handle option selection
    selectOption: function(element, stepNum) {
        // Visual feedback
        const parent = element.parentElement;
        parent.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // Store value
        const value = element.getAttribute('data-value');
        
        switch(stepNum) {
            case 1:
                this.collectedData.goal = value;
                break;
            case 2:
                this.collectedData.household = value;
                break;
            case 3:
                this.collectedData.leftovers = value;
                break;
            case 4:
                this.collectedData.adventure = value;
                break;
        }
        
        console.log('Selected:', this.collectedData);
        
        // Auto-advance after delay
        setTimeout(() => {
            this.nextStep();
        }, 500);
    },
    
    // Go to next step
    nextStep: function() {
        // Skip step 3 if household is 3+ people
        if (this.currentStep === 2 && (this.collectedData.household === '3-4' || this.collectedData.household === '5+')) {
            this.collectedData.leftovers = null; // Not applicable
            this.showStep(4);
        } else if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
    },
    
    // Complete onboarding
    complete: function() {
        console.log('🎉 Onboarding complete!', this.collectedData);
        
        // Get suggested defaults based on goal
        const defaults = this.getSuggestedDefaults(this.collectedData.goal);
        
        // Prepare full user data
        const onboardingData = {
            goal: this.collectedData.goal,
            household: parseInt(this.collectedData.household) || 2,
            leftovers: this.collectedData.leftovers === 'yes',
            adventure: this.collectedData.adventure,
            priorities: {
                flavor: defaults.flavor,
                nutrition: defaults.nutrition,
                healthiness: defaults.healthiness,
                difficulty: 3
            },
            cookingTime: defaults.time,
            skillLevel: defaults.skillLevel,
            cuisines: [], // Will be filled in preferences
            equipment: ['pan', 'knife-set'] // Default minimal equipment
        };
        
        // Save to userData
        userData.completeOnboarding(onboardingData);
        
        // Generate first weekly plan
        mealPlan.generateWeeklyPlan();
        
        // Show weekly plan page
        app.showPage('weekly-plan');
    },
    
    // Reset onboarding
    reset: function() {
        if (confirm('This will reset all your preferences and start over. Are you sure?')) {
            this.currentStep = 1;
            this.collectedData = {
                goal: null,
                household: null,
                leftovers: null,
                adventure: null
            };
            
            // Reset user data
            userData.data.isNew = true;
            userData.data.onboardingComplete = false;
            userData.save();
            
            // Show onboarding
            app.showPage('onboarding');
        }
    }
};
