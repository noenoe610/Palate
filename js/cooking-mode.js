/* ===================================
   COOKING-MODE.JS - Revolutionary Recipe Display
   =================================== */

const cookingMode = {
    currentRecipe: null,
    currentStep: 0,
    timers: {},
    currentServings: null,  // Track current serving size
    
    // Render recipe detail page
    renderRecipeDetail: function(container, recipeId) {
        const recipe = recipes.getRecipeById(recipeId);
        if (!recipe) {
            container.innerHTML = '<div class="empty-state"><h2>Recipe not found</h2></div>';
            return;
        }
        
        this.currentRecipe = recipe;
        const household = userData.data.household || 2;
        const scaleFactor = household / recipe.servings.base;
        
        container.innerHTML = `
            <div class="cooking-mode">
                <!-- Recipe Header -->
                <div class="cooking-header">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                        <div>
                            <span class="badge badge-cuisine">${recipe.cuisine}</span>
                            ${this.renderDietaryBadges(recipe)}
                            <h1 style="color: white; font-size: 32px; margin-top: 8px;">${recipe.name}</h1>
                            <p style="opacity: 0.9; margin-top: 8px;">${recipe.description}</p>
                            ${this.renderCulturalContext(recipe)}
                        </div>
                        <button class="btn btn-secondary btn-small" onclick="app.showPage('recipes')">
                            ← Back
                        </button>
                    </div>
                    
                    ${this.renderAllergenWarning(recipe)}
                    
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 16px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700;">⏱️</div>
                            <div style="font-size: 14px; opacity: 0.9;">${recipe.timing.total_time} min</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700;">👨‍🍳</div>
                            <div style="font-size: 14px; opacity: 0.9;">${recipe.difficulty}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700;">🍽️</div>
                            <div style="font-size: 14px; opacity: 0.9;" id="current-servings">For ${household}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700;">${'⭐'.repeat(recipe.scores.flavor)}</div>
                            <div style="font-size: 14px; opacity: 0.9;">Flavor</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700;">💰</div>
                            <div style="font-size: 14px; opacity: 0.9;" id="cost-per-serving">
                                $${calculateRecipeCost(recipe, household).perServing}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Serving Size Adjuster -->
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin-top: 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span style="font-size: 14px; opacity: 0.9;">Adjust Servings:</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <button onclick="cookingMode.adjustServings('${recipe.id}', -1)" style="
                                background: rgba(255, 255, 255, 0.2);
                                border: 2px solid rgba(255, 255, 255, 0.4);
                                border-radius: 50%;
                                width: 32px;
                                height: 32px;
                                cursor: pointer;
                                font-size: 18px;
                                font-weight: 700;
                                color: white;
                            ">−</button>
                            <span style="font-size: 18px; font-weight: 700; min-width: 60px; text-align: center;" id="servings-display">${household}</span>
                            <button onclick="cookingMode.adjustServings('${recipe.id}', 1)" style="
                                background: rgba(255, 255, 255, 0.2);
                                border: 2px solid rgba(255, 255, 255, 0.4);
                                border-radius: 50%;
                                width: 32px;
                                height: 32px;
                                cursor: pointer;
                                font-size: 18px;
                                font-weight: 700;
                                color: white;
                            ">+</button>
                            <button onclick="cookingMode.resetServings('${recipe.id}')" class="btn btn-secondary btn-small" style="margin-left: 8px;">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Main Content: 2 Column Layout -->
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; margin-top: 32px;">
                    <!-- Sticky Ingredients Sidebar -->
                    <div class="ingredients-sidebar">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h3 class="ingredients-title">📝 Ingredients</h3>
                            <span style="font-size: 12px; color: var(--text-secondary);">For ${household}</span>
                        </div>
                        
                        <button class="btn btn-secondary btn-small btn-full" onclick="cookingMode.showSubstitutionFinder('${recipe.id}')" style="margin-bottom: 16px;">
                            🔄 Find Substitutions
                        </button>
                        
                        ${this.renderIngredients(recipe, scaleFactor)}
                    </div>
                    
                    <!-- Steps -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">👩‍🍳 Instructions</h3>
                            <button class="btn btn-primary btn-small" onclick="cookingMode.startCookingMode()">
                                Start Cooking Mode
                            </button>
                        </div>
                        
                        ${this.renderSteps(recipe)}
                        
                        <!-- Equipment Substitutions -->
                        ${recipe.equipment_substitutions.length > 0 ? `
                            <div class="equipment-note" style="margin-top: 24px;">
                                <strong>🔧 Equipment Substitutions:</strong><br>
                                ${recipe.equipment_substitutions.map(sub => 
                                    `${sub.original} → ${sub.substitute}: ${sub.note}`
                                ).join('<br>')}
                            </div>
                        ` : ''}
                        
                        <!-- Nutrition Info -->
                        <div class="card card-light" style="margin-top: 24px;">
                            <h4 style="color: var(--text-primary); margin-bottom: 8px;">📊 Nutrition & Macros</h4>
                            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                                Per serving
                            </p>
                            
                            ${this.renderMacroCalculator(recipe)}
                        </div>
                        
                        <!-- Actions -->
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button class="btn btn-primary" onclick="cookingMode.markAsCooked('${recipe.id}')">
                                ✅ Mark as Cooked
                            </button>
                            <button class="btn btn-secondary" onclick="cookingMode.toggleFavorite('${recipe.id}')">
                                ${userData.isFavorite(recipe.id) ? '❤️ Favorited' : '🤍 Add to Favorites'}
                            </button>
                            <button class="btn btn-secondary" onclick="cookingMode.showAddToCollectionModal('${recipe.id}')">
                                📚 Add to Collection
                            </button>
                        </div>
                        
                        <!-- User Notes -->
                        <div class="card card-light" style="margin-top: 24px;">
                            <h4 style="color: var(--text-primary); margin-bottom: 12px;">📝 My Notes</h4>
                            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 12px;">
                                Add your personal tips, modifications, or reminders for this recipe
                            </p>
                            <div id="recipe-notes-section">
                                ${this.renderRecipeNotes(recipe.id)}
                            </div>
                        </div>
                        
                        <!-- Photo Gallery -->
                        <div class="card card-light" style="margin-top: 24px;">
                            <h4 style="color: var(--text-primary); margin-bottom: 12px;">📸 My Photos</h4>
                            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">
                                Share photos of your cooking results! (Max 5 photos)
                            </p>
                            
                            <div id="recipe-photos-section">
                                ${this.renderPhotoGallery(recipe.id)}
                            </div>
                            
                            <div style="margin-top: 16px;">
                                <input type="file" id="photo-upload-${recipe.id}" accept="image/*" style="display: none;" 
                                    onchange="cookingMode.handlePhotoUpload('${recipe.id}', this)">
                                <button class="btn btn-primary btn-small" onclick="document.getElementById('photo-upload-${recipe.id}').click()">
                                    📷 Upload Photo
                                </button>
                                <span style="font-size: 12px; color: var(--text-secondary); margin-left: 12px;">
                                    JPG, PNG, GIF (max 2MB)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render ingredients list
    renderIngredients: function(recipe, scaleFactor) {
        const progress = userData.getRecipeProgress(recipe.id);
        const userUnits = userData.getUnits();
        
        return recipe.ingredients.map((ing, index) => {
            const scaledAmount = (ing.amount * scaleFactor);
            let displayAmount = scaledAmount;
            let displayUnit = ing.unit;
            
            // Convert units if needed
            if (userUnits === 'metric') {
                const converted = userData.convertUnits(scaledAmount, ing.unit, 'metric');
                displayAmount = converted.amount;
                displayUnit = converted.unit;
            }
            
            const formattedAmount = this.formatAmount(displayAmount);
            const isChecked = progress.completedIngredients.includes(index);
            
            return `
                <div class="ingredient-item">
                    <input type="checkbox" class="ingredient-checkbox" id="ing-${index}" 
                        ${isChecked ? 'checked' : ''}
                        onchange="cookingMode.toggleIngredient('${recipe.id}', ${index}, this.checked)">
                    <label for="ing-${index}" class="ingredient-text ${isChecked ? 'checked' : ''}">
                        <strong>${formattedAmount} ${displayUnit}</strong> ${ing.name}
                        ${ing.preparation ? `<br><em style="font-size: 12px; color: var(--text-secondary);">${ing.preparation}</em>` : ''}
                    </label>
                </div>
            `;
        }).join('');
    },
    
    // Render cooking steps
    renderSteps: function(recipe) {
        const progress = userData.getRecipeProgress(recipe.id);
        
        return recipe.instructions.map((step, index) => {
            const isCompleted = progress.completedSteps.includes(index);
            
            return `
            <div class="step-card ${isCompleted ? 'completed' : ''}" id="step-${index}">
                <div class="step-header">
                    <span class="step-number">Step ${step.step} ${isCompleted ? '✓' : ''}</span>
                    ${step.timer_seconds ? `
                        <span class="timer-display" id="timer-${index}">
                            ⏱️ ${this.formatTime(step.timer_seconds)}
                        </span>
                    ` : ''}
                </div>
                
                <h4 class="step-title">${step.title}</h4>
                <p class="step-instruction">${step.instruction}</p>
                
                ${step.tips ? `
                    <div class="step-tips">
                        <strong>💡 Tip:</strong> ${step.tips}
                    </div>
                ` : ''}
                
                <div class="step-actions">
                    ${step.timer_seconds ? `
                        <button class="btn btn-secondary btn-small" onclick="cookingMode.startTimer(${index}, ${step.timer_seconds})">
                            ⏰ Start Timer
                        </button>
                    ` : ''}
                    <button class="btn btn-primary btn-small" onclick="cookingMode.completeStep('${recipe.id}', ${index})">
                        ${isCompleted ? '↩️ Mark Incomplete' : '✓ Mark Complete'}
                    </button>
                </div>
            </div>
        `}).join('');
    },
    
    // Format amount for display
    formatAmount: function(amount) {
        if (amount < 0.125) {
            return (Math.round(amount * 16) / 16).toFixed(2);
        } else if (amount < 1) {
            return (Math.round(amount * 4) / 4).toFixed(2);
        } else if (amount < 10) {
            return (Math.round(amount * 2) / 2).toFixed(1);
        } else {
            return Math.round(amount).toString();
        }
    },
    
    // Format time (seconds to MM:SS)
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Start a timer for a step
    startTimer: function(stepIndex, duration) {
        console.log(`⏰ Starting timer for step ${stepIndex + 1}: ${duration}s`);
        
        // Clear existing timer if any
        if (this.timers[stepIndex]) {
            clearInterval(this.timers[stepIndex]);
        }
        
        let remaining = duration;
        const timerElement = document.getElementById(`timer-${stepIndex}`);
        
        this.timers[stepIndex] = setInterval(() => {
            remaining--;
            timerElement.textContent = `⏱️ ${this.formatTime(remaining)}`;
            
            if (remaining <= 0) {
                clearInterval(this.timers[stepIndex]);
                timerElement.textContent = '✅ Done!';
                timerElement.style.background = '#10B981';
                
                // Play sound or notification
                this.playTimerSound();
                alert(`⏰ Timer complete for: ${this.currentRecipe.instructions[stepIndex].title}`);
            }
        }, 1000);
    },
    
    // Play timer sound
    playTimerSound: function() {
        // Browser beep
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
    },
    
    // Complete a step
    completeStep: function(recipeId, stepIndex) {
        userData.toggleStepCompletion(recipeId, stepIndex);
        
        const stepCard = document.getElementById(`step-${stepIndex}`);
        stepCard.classList.toggle('completed');
        
        // Update button text
        const button = stepCard.querySelector('.btn-primary');
        const isCompleted = stepCard.classList.contains('completed');
        button.textContent = isCompleted ? '↩️ Mark Incomplete' : '✓ Mark Complete';
        
        // Auto-scroll to next incomplete step
        if (isCompleted) {
            const nextStep = document.getElementById(`step-${stepIndex + 1}`);
            if (nextStep && !nextStep.classList.contains('completed')) {
                nextStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },
    
    // Toggle ingredient
    toggleIngredient: function(recipeId, ingredientIndex, isChecked) {
        userData.toggleIngredientCompletion(recipeId, ingredientIndex);
        
        const label = document.querySelector(`label[for="ing-${ingredientIndex}"]`);
        if (isChecked) {
            label.classList.add('checked');
        } else {
            label.classList.remove('checked');
        }
    },
    
    // Start cooking mode (larger text, focused view)
    startCookingMode: function() {
        if (!this.currentRecipe) return;
        
        const recipe = this.currentRecipe;
        const household = this.currentServings || userData.data.household || 2;
        const scaleFactor = household / recipe.servings.base;
        
        // Create fullscreen cooking mode overlay
        const modal = document.createElement('div');
        modal.id = 'hands-free-cooking-mode';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-main);
            z-index: 2000;
            overflow-y: auto;
            padding: 24px;
        `;
        
        const progress = userData.getRecipeProgress(recipe.id);
        const currentStepIndex = progress.completedSteps.length > 0 
            ? Math.max(...progress.completedSteps) + 1 
            : 0;
        
        modal.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h1 style="font-size: 32px; color: var(--text-primary);">${recipe.name}</h1>
                    <button onclick="cookingMode.exitHandsFreeMode()" class="btn btn-secondary">
                        Exit Cooking Mode
                    </button>
                </div>
                
                <!-- Progress Bar -->
                <div style="margin-bottom: 32px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 18px; font-weight: 600; color: var(--text-primary);">
                            Step <span id="hf-current-step">${currentStepIndex + 1}</span> of ${recipe.instructions.length}
                        </span>
                        <span style="font-size: 16px; color: var(--text-secondary);" id="hf-progress-text">
                            ${Math.round((currentStepIndex / recipe.instructions.length) * 100)}% Complete
                        </span>
                    </div>
                    <div class="progress-bar" style="height: 16px;">
                        <div class="progress-fill" id="hf-progress-fill" style="width: ${(currentStepIndex / recipe.instructions.length) * 100}%;"></div>
                    </div>
                </div>
                
                <!-- Current Step Display -->
                <div id="hf-step-container" style="min-height: 400px;">
                    ${this.renderHandsFreeStep(recipe, currentStepIndex, scaleFactor)}
                </div>
                
                <!-- Navigation -->
                <div style="display: flex; gap: 16px; margin-top: 32px; justify-content: center;">
                    <button id="hf-prev-btn" onclick="cookingMode.handsFreeNavigate(-1)" 
                        class="btn btn-secondary btn-large" ${currentStepIndex === 0 ? 'disabled' : ''}>
                        ← Previous Step
                    </button>
                    <button id="hf-next-btn" onclick="cookingMode.handsFreeNavigate(1)" 
                        class="btn btn-primary btn-large" ${currentStepIndex >= recipe.instructions.length - 1 ? 'disabled' : ''}>
                        Next Step →
                    </button>
                </div>
                
                <!-- Ingredients Quick Reference -->
                <div class="card card-light" style="margin-top: 32px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="color: var(--text-primary);">📝 Ingredients Quick Reference</h3>
                        <button onclick="document.getElementById('hf-ingredients').classList.toggle('hidden')" class="btn btn-secondary btn-small">
                            Toggle
                        </button>
                    </div>
                    <div id="hf-ingredients" style="max-height: 300px; overflow-y: auto;">
                        ${this.renderIngredients(recipe, scaleFactor)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.handsFreeCurrentStep = currentStepIndex;
    },
    
    // Render hands-free step
    renderHandsFreeStep: function(recipe, stepIndex, scaleFactor) {
        if (stepIndex < 0 || stepIndex >= recipe.instructions.length) {
            return `
                <div class="card card-main" style="padding: 48px; text-align: center;">
                    <h2 style="font-size: 36px; margin-bottom: 16px;">🎉 Recipe Complete!</h2>
                    <p style="font-size: 20px; opacity: 0.9; margin-bottom: 24px;">Great job! Time to enjoy your ${recipe.name}</p>
                    <button onclick="cookingMode.exitHandsFreeMode()" class="btn btn-secondary btn-large">
                        Exit Cooking Mode
                    </button>
                </div>
            `;
        }
        
        const step = recipe.instructions[stepIndex];
        const progress = userData.getRecipeProgress(recipe.id);
        const isCompleted = progress.completedSteps.includes(stepIndex);
        
        return `
            <div class="card card-white" style="padding: 40px;">
                <div style="font-size: 18px; font-weight: 600; color: var(--orange-main); margin-bottom: 16px;">
                    STEP ${step.step}
                </div>
                
                <h2 style="font-size: 36px; font-weight: 700; color: var(--text-primary); margin-bottom: 24px; line-height: 1.3;">
                    ${step.title}
                </h2>
                
                <p style="font-size: 24px; color: var(--text-primary); margin-bottom: 32px; line-height: 1.6;">
                    ${step.instruction}
                </p>
                
                ${step.tips ? `
                    <div style="
                        background: #FEF3C7;
                        border: 3px solid #F59E0B;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 32px;
                    ">
                        <div style="font-size: 20px; font-weight: 600; color: #92400E; margin-bottom: 8px;">
                            💡 Pro Tip
                        </div>
                        <div style="font-size: 18px; color: #92400E;">
                            ${step.tips}
                        </div>
                    </div>
                ` : ''}
                
                ${step.timer_seconds ? `
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="font-size: 64px; font-weight: 700; color: var(--orange-main); margin-bottom: 16px;" id="hf-timer-display">
                            ${this.formatTime(step.timer_seconds)}
                        </div>
                        <button onclick="cookingMode.startHandsFreeTimer(${stepIndex}, ${step.timer_seconds})" 
                            class="btn btn-primary btn-large" id="hf-timer-btn">
                            ⏰ Start ${this.formatTime(step.timer_seconds)} Timer
                        </button>
                    </div>
                ` : ''}
                
                <div style="text-align: center;">
                    <button onclick="cookingMode.toggleHandsFreeStepComplete(${stepIndex})" 
                        class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-large">
                        ${isCompleted ? '✓ Completed - Mark Incomplete' : '✓ Mark Step Complete'}
                    </button>
                </div>
            </div>
        `;
    },
    
    // Navigate in hands-free mode
    handsFreeNavigate: function(direction) {
        if (!this.currentRecipe) return;
        
        this.handsFreeCurrentStep += direction;
        
        // Bounds check
        if (this.handsFreeCurrentStep < 0) {
            this.handsFreeCurrentStep = 0;
            return;
        }
        if (this.handsFreeCurrentStep > this.currentRecipe.instructions.length) {
            this.handsFreeCurrentStep = this.currentRecipe.instructions.length;
        }
        
        // Update UI
        const scaleFactor = (this.currentServings || userData.data.household || 2) / this.currentRecipe.servings.base;
        document.getElementById('hf-step-container').innerHTML = 
            this.renderHandsFreeStep(this.currentRecipe, this.handsFreeCurrentStep, scaleFactor);
        
        // Update progress
        document.getElementById('hf-current-step').textContent = this.handsFreeCurrentStep + 1;
        const progressPercent = (this.handsFreeCurrentStep / this.currentRecipe.instructions.length) * 100;
        document.getElementById('hf-progress-fill').style.width = progressPercent + '%';
        document.getElementById('hf-progress-text').textContent = Math.round(progressPercent) + '% Complete';
        
        // Update buttons
        document.getElementById('hf-prev-btn').disabled = this.handsFreeCurrentStep === 0;
        document.getElementById('hf-next-btn').disabled = this.handsFreeCurrentStep >= this.currentRecipe.instructions.length - 1;
        
        // Scroll to top
        document.getElementById('hands-free-cooking-mode').scrollTop = 0;
    },
    
    // Start timer in hands-free mode
    startHandsFreeTimer: function(stepIndex, duration) {
        let remaining = duration;
        const display = document.getElementById('hf-timer-display');
        const button = document.getElementById('hf-timer-btn');
        
        button.textContent = 'Timer Running...';
        button.disabled = true;
        
        const interval = setInterval(() => {
            remaining--;
            display.textContent = this.formatTime(remaining);
            
            if (remaining <= 0) {
                clearInterval(interval);
                display.textContent = '✅ DONE!';
                display.style.color = '#10B981';
                button.textContent = 'Timer Complete!';
                button.style.background = '#10B981';
                
                // Play sound
                this.playTimerSound();
                
                // Show alert
                setTimeout(() => {
                    alert(`⏰ Timer complete! ${this.currentRecipe.instructions[stepIndex].title}`);
                }, 100);
            }
        }, 1000);
    },
    
    // Toggle step completion in hands-free mode
    toggleHandsFreeStepComplete: function(stepIndex) {
        if (!this.currentRecipe) return;
        
        userData.toggleStepCompletion(this.currentRecipe.id, stepIndex);
        
        // Re-render the step
        const scaleFactor = (this.currentServings || userData.data.household || 2) / this.currentRecipe.servings.base;
        document.getElementById('hf-step-container').innerHTML = 
            this.renderHandsFreeStep(this.currentRecipe, stepIndex, scaleFactor);
        
        // Update progress
        const progress = userData.getRecipeProgress(this.currentRecipe.id);
        const progressPercent = (progress.completedSteps.length / this.currentRecipe.instructions.length) * 100;
        document.getElementById('hf-progress-fill').style.width = progressPercent + '%';
        document.getElementById('hf-progress-text').textContent = Math.round(progressPercent) + '% Complete';
    },
    
    // Exit hands-free mode
    exitHandsFreeMode: function() {
        const modal = document.getElementById('hands-free-cooking-mode');
        if (modal) {
            modal.remove();
        }
        this.handsFreeCurrentStep = 0;
    },
    
    // Mark recipe as cooked
    markAsCooked: function(recipeId) {
        mealPlan.markAsCooked(recipeId);
        alert('✅ Great job! Recipe marked as cooked.');
        
        // Update UI
        app.showPage('recipe-detail');
    },
    
    // Toggle favorite
    toggleFavorite: function(recipeId) {
        if (userData.isFavorite(recipeId)) {
            userData.removeFavorite(recipeId);
            alert('💔 Removed from favorites');
        } else {
            userData.addFavorite(recipeId);
            alert('❤️ Added to favorites!');
        }
        
        // Update UI
        app.viewRecipe(recipeId);
    },
    
    // Render allergen warning
    renderAllergenWarning: function(recipe) {
        if (!recipe.allergens || recipe.allergens.length === 0) {
            return '';
        }
        
        const allergenIcons = {
            'dairy': '🥛',
            'eggs': '🥚',
            'fish': '🐟',
            'shellfish': '🦐',
            'peanuts': '🥜',
            'soy': '🫘',
            'gluten': '🌾',
            'nuts': '🌰',
            'sesame': '🌰',
            'alcohol': '🍷'
        };
        
        const allergenList = recipe.allergens.map(allergen => {
            const icon = allergenIcons[allergen.toLowerCase()] || '⚠️';
            return `${icon} ${allergen.charAt(0).toUpperCase() + allergen.slice(1)}`;
        }).join(', ');
        
        return `
            <div style="
                background: #FEF2F2;
                border: 2px solid #EF4444;
                border-radius: 8px;
                padding: 12px 16px;
                margin-top: 16px;
            ">
                <strong style="color: #991B1B;">⚠️ Allergen Warning:</strong>
                <span style="color: #7F1D1D;"> Contains ${allergenList}</span>
            </div>
        `;
    },
    
    // Render dietary badges (for recipe header)
    renderDietaryBadges: function(recipe) {
        const badges = [];
        
        if (recipe.dietary_tags.includes('vegetarian')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">🥬 Vegetarian</span>');
        }
        if (recipe.dietary_tags.includes('vegan')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">🌱 Vegan</span>');
        }
        if (recipe.dietary_tags.some(tag => tag.includes('gluten-free'))) {
            badges.push('<span class="badge" style="background: #FEF3C7; border-color: #F59E0B; color: #92400E; margin-left: 4px;">🌾 Gluten-Free</span>');
        }
        if (recipe.dietary_tags.includes('dairy-free')) {
            badges.push('<span class="badge" style="background: #E0F2FE; border-color: #0EA5E9; color: #0369A1; margin-left: 4px;">🥛 Dairy-Free</span>');
        }
        if (recipe.dietary_tags.includes('halal')) {
            badges.push('<span class="badge" style="background: #D1FAE5; border-color: #10B981; color: #065F46; margin-left: 4px;">☪️ Halal</span>');
        }
        if (recipe.dietary_tags.includes('kosher')) {
            badges.push('<span class="badge" style="background: #DBEAFE; border-color: #3B82F6; color: #1E40AF; margin-left: 4px;">✡️ Kosher</span>');
        }
        
        return badges.join('');
    },
    
    // Render recipe notes
    renderRecipeNotes: function(recipeId) {
        const note = userData.getRecipeNote(recipeId);
        const cookCount = userData.getRecipeCookCount(recipeId);
        
        if (!note && cookCount === 0) {
            return `
                <p style="color: var(--text-secondary); font-style: italic; font-size: 14px;">
                    No notes yet. Cook this recipe and add your thoughts!
                </p>
            `;
        }
        
        return `
            <div id="notes-display-${recipeId}" style="${note ? '' : 'display:none;'}">
                <div style="
                    background: white;
                    border: 2px solid var(--orange-light);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 12px;
                    white-space: pre-wrap;
                    color: var(--text-primary);
                    font-size: 14px;
                    line-height: 1.6;
                ">${note || 'No notes yet'}</div>
                <button class="btn btn-secondary btn-small" onclick="cookingMode.editNote('${recipeId}')">
                    ✏️ Edit Note
                </button>
            </div>
            
            <div id="notes-edit-${recipeId}" style="${note ? 'display:none;' : ''}">
                <textarea id="notes-textarea-${recipeId}" style="
                    width: 100%;
                    min-height: 120px;
                    padding: 12px;
                    border: 2px solid var(--orange-light);
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    margin-bottom: 12px;
                " placeholder="e.g., I doubled the garlic and it was amazing! Next time try adding lemon zest.">${note}</textarea>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary btn-small" onclick="cookingMode.saveNote('${recipeId}')">
                        💾 Save Note
                    </button>
                    ${note ? `<button class="btn btn-secondary btn-small" onclick="cookingMode.cancelEditNote('${recipeId}')">Cancel</button>` : ''}
                    ${note ? `<button class="btn btn-secondary btn-small" onclick="cookingMode.deleteNote('${recipeId}')" style="margin-left: auto;">🗑️ Delete</button>` : ''}
                </div>
            </div>
        `;
    },
    
    // Edit note
    editNote: function(recipeId) {
        document.getElementById(`notes-display-${recipeId}`).style.display = 'none';
        document.getElementById(`notes-edit-${recipeId}`).style.display = 'block';
        document.getElementById(`notes-textarea-${recipeId}`).focus();
    },
    
    // Cancel edit note
    cancelEditNote: function(recipeId) {
        document.getElementById(`notes-display-${recipeId}`).style.display = 'block';
        document.getElementById(`notes-edit-${recipeId}`).style.display = 'none';
    },
    
    // Save note
    saveNote: function(recipeId) {
        const textarea = document.getElementById(`notes-textarea-${recipeId}`);
        const note = textarea.value.trim();
        
        userData.saveRecipeNote(recipeId, note);
        
        // Refresh the notes section
        document.getElementById('recipe-notes-section').innerHTML = this.renderRecipeNotes(recipeId);
        
        alert('✅ Note saved!');
    },
    
    // Delete note
    deleteNote: function(recipeId) {
        if (confirm('Delete this note?')) {
            userData.deleteRecipeNote(recipeId);
            document.getElementById('recipe-notes-section').innerHTML = this.renderRecipeNotes(recipeId);
            alert('🗑️ Note deleted');
        }
    },
    
    // Adjust servings
    adjustServings: function(recipeId, change) {
        const recipe = recipes.getRecipeById(recipeId);
        if (!recipe) return;
        
        // Initialize if first time
        if (this.currentServings === null) {
            this.currentServings = userData.data.household || 2;
        }
        
        // Adjust (minimum 1)
        this.currentServings = Math.max(1, this.currentServings + change);
        
        // Update display
        document.getElementById('servings-display').textContent = this.currentServings;
        document.getElementById('current-servings').textContent = `For ${this.currentServings}`;
        
        // Update cost
        const cost = calculateRecipeCost(recipe, this.currentServings);
        document.getElementById('cost-per-serving').textContent = `$${cost.perServing}`;
        
        // Recalculate and re-render ingredients
        const scaleFactor = this.currentServings / recipe.servings.base;
        const ingredientsContainer = document.querySelector('.ingredients-sidebar');
        const titleHTML = ingredientsContainer.querySelector('.ingredients-title').parentElement.outerHTML;
        
        ingredientsContainer.innerHTML = titleHTML + this.renderIngredients(recipe, scaleFactor);
    },
    
    // Reset servings to household default
    resetServings: function(recipeId) {
        const recipe = recipes.getRecipeById(recipeId);
        if (!recipe) return;
        
        const household = userData.data.household || 2;
        this.currentServings = household;
        
        // Update display
        document.getElementById('servings-display').textContent = household;
        document.getElementById('current-servings').textContent = `For ${household}`;
        
        // Recalculate and re-render ingredients
        const scaleFactor = household / recipe.servings.base;
        const ingredientsContainer = document.querySelector('.ingredients-sidebar');
        const titleHTML = ingredientsContainer.querySelector('.ingredients-title').parentElement.outerHTML;
        
        ingredientsContainer.innerHTML = titleHTML + this.renderIngredients(recipe, scaleFactor);
    },
    
    // Render photo gallery
    renderPhotoGallery: function(recipeId) {
        const photos = userData.getRecipePhotos(recipeId);
        
        if (photos.length === 0) {
            return `
                <p style="color: var(--text-secondary); font-style: italic; font-size: 14px;">
                    No photos yet. Cook this recipe and share your results!
                </p>
            `;
        }
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
                ${photos.map((photo, index) => `
                    <div style="position: relative; border-radius: 8px; overflow: hidden; border: 2px solid var(--orange-light);">
                        <img src="${photo}" alt="Recipe photo ${index + 1}" style="
                            width: 100%;
                            height: 150px;
                            object-fit: cover;
                            cursor: pointer;
                        " onclick="cookingMode.viewPhotoFullscreen('${recipeId}', ${index})">
                        <button onclick="cookingMode.deletePhoto('${recipeId}', ${index})" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(255, 255, 255, 0.9);
                            border: 2px solid var(--orange-main);
                            border-radius: 50%;
                            width: 28px;
                            height: 28px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: 700;
                            color: var(--orange-dark);
                        ">×</button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Handle photo upload
    handlePhotoUpload: function(recipeId, input) {
        const file = input.files[0];
        if (!file) return;
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Photo is too large! Please use a photo under 2MB.');
            input.value = '';
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, GIF)');
            input.value = '';
            return;
        }
        
        // Read file as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataURL = e.target.result;
            
            // Add to userData
            if (userData.addRecipePhoto(recipeId, dataURL)) {
                // Refresh gallery
                document.getElementById('recipe-photos-section').innerHTML = this.renderPhotoGallery(recipeId);
                alert('✅ Photo uploaded!');
            }
            
            // Clear input
            input.value = '';
        };
        
        reader.onerror = () => {
            alert('Error reading photo file');
            input.value = '';
        };
        
        reader.readAsDataURL(file);
    },
    
    // Delete photo
    deletePhoto: function(recipeId, photoIndex) {
        if (confirm('Delete this photo?')) {
            userData.deleteRecipePhoto(recipeId, photoIndex);
            document.getElementById('recipe-photos-section').innerHTML = this.renderPhotoGallery(recipeId);
            alert('🗑️ Photo deleted');
        }
    },
    
    // View photo fullscreen
    viewPhotoFullscreen: function(recipeId, photoIndex) {
        const photos = userData.getRecipePhotos(recipeId);
        if (!photos[photoIndex]) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            cursor: pointer;
        `;
        
        modal.innerHTML = `
            <img src="${photos[photoIndex]}" style="
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            ">
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            ">×</button>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.tagName === 'IMG') {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    },
    
    // Render macro calculator
    renderMacroCalculator: function(recipe) {
        const nutrition = recipe.nutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        };
        
        // Calculate calories from macros (for verification)
        const proteinCals = nutrition.protein * 4;
        const carbsCals = nutrition.carbs * 4;
        const fatCals = nutrition.fat * 9;
        const totalMacroCals = proteinCals + carbsCals + fatCals;
        
        // Calculate percentages
        const proteinPercent = totalMacroCals > 0 ? Math.round((proteinCals / totalMacroCals) * 100) : 0;
        const carbsPercent = totalMacroCals > 0 ? Math.round((carbsCals / totalMacroCals) * 100) : 0;
        const fatPercent = totalMacroCals > 0 ? Math.round((fatCals / totalMacroCals) * 100) : 0;
        
        return `
            <!-- Calories (Big Display) -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; font-weight: 700; color: var(--orange-main);">
                    ${nutrition.calories}
                </div>
                <div style="font-size: 14px; color: var(--text-secondary); font-weight: 600;">
                    CALORIES
                </div>
            </div>
            
            <!-- Macro Breakdown -->
            <div style="margin-bottom: 20px;">
                <h5 style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
                    MACRONUTRIENTS
                </h5>
                
                <!-- Protein -->
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
                            Protein
                        </span>
                        <span style="font-size: 14px; font-weight: 700; color: var(--orange-main);">
                            ${nutrition.protein}g (${proteinPercent}%)
                        </span>
                    </div>
                    <div style="background: #FFE5CC; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: #10B981; height: 100%; width: ${proteinPercent}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                        ${proteinCals} calories from protein
                    </div>
                </div>
                
                <!-- Carbs -->
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
                            Carbohydrates
                        </span>
                        <span style="font-size: 14px; font-weight: 700; color: var(--orange-main);">
                            ${nutrition.carbs}g (${carbsPercent}%)
                        </span>
                    </div>
                    <div style="background: #FFE5CC; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: #F59E0B; height: 100%; width: ${carbsPercent}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                        ${carbsCals} calories from carbs
                    </div>
                </div>
                
                <!-- Fat -->
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
                            Fat
                        </span>
                        <span style="font-size: 14px; font-weight: 700; color: var(--orange-main);">
                            ${nutrition.fat}g (${fatPercent}%)
                        </span>
                    </div>
                    <div style="background: #FFE5CC; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: #EF4444; height: 100%; width: ${fatPercent}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                        ${fatCals} calories from fat
                    </div>
                </div>
                
                <!-- Fiber (if available) -->
                ${nutrition.fiber > 0 ? `
                    <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--orange-light);">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 13px; color: var(--text-primary);">Fiber</span>
                            <span style="font-size: 13px; font-weight: 600; color: var(--orange-main);">${nutrition.fiber}g</span>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Macro Ratio Summary -->
            <div style="
                background: var(--orange-lightest);
                border: 2px solid var(--orange-light);
                border-radius: 8px;
                padding: 12px;
                text-align: center;
            ">
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">
                    MACRO RATIO
                </div>
                <div style="font-size: 16px; font-weight: 700; color: var(--orange-dark);">
                    ${proteinPercent}% / ${carbsPercent}% / ${fatPercent}%
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
                    Protein / Carbs / Fat
                </div>
            </div>
        `;
    },
    
    // Render cultural context
    renderCulturalContext: function(recipe) {
        const contexts = {
            'Mapo Tofu': {
                context: 'A classic Szechuan dish named after an elderly woman with pockmarked face (má pó) who created it in Chengdu during the Qing Dynasty.',
                traditionally: 'Served piping hot with rice to balance the numbing málà spice. The combination of Sichuan peppercorns and chili creates the signature flavor.',
                pronunciation: 'mah-poh doe-foo'
            },
            'Thai Green Curry': {
                context: 'Green curry (gaeng keow wan) gets its vibrant color from fresh green chilies. Central Thai dish influenced by Indian curry traditions.',
                traditionally: 'Made with Thai eggplants and served with jasmine rice. The sweetness comes from coconut milk and palm sugar.',
                pronunciation: 'gang kee-ow wahn'
            },
            'Cacio e Pepe': {
                context: 'Roman shepherds created this with shelf-stable ingredients they could carry in the mountains. One of Rome\'s four classic pasta dishes.',
                traditionally: 'Made with only pecorino Romano, black pepper, and pasta water—no cream! The technique creates a silky sauce from starch and cheese.',
                pronunciation: 'kah-cho eh peh-peh'
            },
            'Kung Pao Chicken': {
                context: 'Named after Ding Baozhen, a Qing Dynasty official whose title was Kung Pao (Palace Guardian). Originally from Sichuan province.',
                traditionally: 'The authentic version uses Sichuan peppercorns for málà (numbing-spicy) sensation, unlike the sweeter American-Chinese version.',
                pronunciation: 'goong pow'
            },
            'Pad Thai': {
                context: 'Thailand\'s national dish was popularized in the 1930s-40s as part of a nationalist campaign. Despite being "traditional," it\'s relatively modern.',
                traditionally: 'Street food served wrapped in banana leaves. The balance of sweet, sour, salty, and spicy is key.',
                pronunciation: 'pad tie'
            },
            'Teriyaki Salmon': {
                context: 'Teriyaki means "glossy grilled" (teri = luster, yaki = grilled). Originally a Japanese cooking technique, now global.',
                traditionally: 'Fish is marinated, then grilled or broiled. The glaze should be shiny and slightly caramelized.',
                pronunciation: 'teh-ree-yah-kee'
            },
            'Miso Soup': {
                context: 'A staple of Japanese cuisine for over 1,000 years. Miso paste is made from fermented soybeans and is rich in probiotics.',
                traditionally: 'Served at breakfast with rice. The miso should never boil as it destroys beneficial bacteria and flavor.',
                pronunciation: 'mee-so'
            },
            'Pho Bo': {
                context: 'Vietnam\'s national dish originated in early 20th century Hanoi. The broth is simmered for hours with charred onions and ginger.',
                traditionally: 'Eaten for breakfast. Diners customize with fresh herbs, lime, chilies, and hoisin sauce at the table.',
                pronunciation: 'fuh baw'
            },
            'Dal Tadka': {
                context: 'Tadka (tempering) is the technique of blooming spices in hot oil. Dal (lentils) is a protein staple across India.',
                traditionally: 'Comfort food served with rice or roti. Each region has its own variation of spices and lentil types.',
                pronunciation: 'dahl tad-kah'
            },
            'Butter Chicken': {
                context: 'Invented in 1950s Delhi by the owners of Moti Mahal restaurant. Created by adding tomato and cream to leftover tandoori chicken.',
                traditionally: 'Cooked in a tandoor oven for smoky flavor. The creamy sauce balances the spiced chicken perfectly.',
                pronunciation: 'mur-gh mak-kha-nee'
            },
            'Pasta Pomodoro': {
                context: 'Simple Italian dish celebrating the tomato (pomodoro). Pomodoro means "golden apple" - what Italians first called tomatoes.',
                traditionally: 'Made with San Marzano tomatoes from volcanic soil near Naples. Simplicity is key - let quality ingredients shine.',
                pronunciation: 'poh-moh-doh-roh'
            },
            'Risotto alla Milanese': {
                context: 'Milan\'s signature dish gets its golden color from saffron. Legend says it was invented at a wedding in 1574.',
                traditionally: 'Served as a first course. The rice should be creamy and flow like lava when plated (all\'onda).',
                pronunciation: 'ree-zoh-toh ah-lah mee-lah-neh-zeh'
            },
            'Paella Valenciana': {
                context: 'Spain\'s most famous dish originated in Valencia\'s rice fields. Workers cooked it over open fires using local ingredients.',
                traditionally: 'Cooked in a wide, shallow pan over open flame. The crispy bottom layer (socarrat) is prized. Never stirred once rice is added!',
                pronunciation: 'pah-eh-yah vah-len-see-ah-nah'
            },
            'Shakshuka': {
                context: 'North African dish popular across Middle East. Name comes from Arabic "mixture." Brought to Israel by Tunisian Jews.',
                traditionally: 'Eaten directly from the pan with bread for dipping. Often served for breakfast.',
                pronunciation: 'shahk-shoo-kah'
            },
            'Tacos al Pastor': {
                context: 'Mexican adaptation of Lebanese shawarma brought by immigrants in the 1900s. Vertical spit-roasting technique from Middle East.',
                traditionally: 'Served on small corn tortillas with pineapple, cilantro, and onion. The pineapple on top bastes the meat as it cooks.',
                pronunciation: 'tah-kohs ahl pahs-tohr'
            },
            'Vietnamese Spring Rolls': {
                context: 'Fresh rolls (gỏi cuốn) showcase Vietnamese love for fresh herbs and vegetables. Different from fried spring rolls.',
                traditionally: 'Wrapped tightly in rice paper at the table. Each diner makes their own. The wrapper should be translucent showing ingredients.',
                pronunciation: 'goy koo-uhn'
            },
            'Chana Masala': {
                context: 'Punjabi chickpea curry that\'s both street food and home cooking. Chana means chickpeas, masala means spice blend.',
                traditionally: 'Served with bhatura (fried bread) as street food, or with rice at home. The dark color comes from tea or pomegranate.',
                pronunciation: 'chah-nah mah-sah-lah'
            },
            'Ratatouille': {
                context: 'Provençal vegetable stew from southern France. Made famous by peasant farmers using summer vegetables.',
                traditionally: 'Each vegetable cooked separately then combined. Can be rustic or elegantly arranged. Best enjoyed at room temperature.',
                pronunciation: 'rah-tah-too-ee'
            },
            'Mac and Cheese': {
                context: 'American comfort food with European roots. Jefferson served a pasta dish with cheese at White House in 1802.',
                traditionally: 'Soul food staple and holiday favorite. Baked version with crispy topping became popular in the South.',
                pronunciation: 'mak and cheez'
            },
            'Cantonese Fried Rice': {
                context: 'Originated in Canton (Guangzhou) as a way to use leftover rice. The high heat of wok cooking creates "wok hei" (breath of wok).',
                traditionally: 'Made with day-old rice that\'s dried out. Each grain should be separate and slightly crispy. Never mushy!',
                pronunciation: 'chahw fahn'
            },
            'Falafel': {
                context: 'Ancient Middle Eastern dish, possibly Egyptian or Levantine origin. Debate continues over its birthplace.',
                traditionally: 'Made with dried chickpeas (never canned!). Served in pita with tahini, pickles, and salad. Popular street food.',
                pronunciation: 'fah-lah-fel'
            },
            'Hummus': {
                context: 'Levantine dip eaten across Middle East for centuries. The word means "chickpeas" in Arabic.',
                traditionally: 'Served warm with a pool of olive oil on top. Scooped with pita bread. Each region claims the best version.',
                pronunciation: 'hoo-moos'
            },
            'Tortilla Española': {
                context: 'Spanish potato omelette, not to be confused with Mexican tortillas! A tapa staple across Spain.',
                traditionally: 'Debate rages over whether to include onions. Eaten at room temperature in bars. The flip is a moment of truth!',
                pronunciation: 'tor-tee-yah es-pahn-yoh-lah'
            },
            'Classic Roast Chicken': {
                context: 'Sunday roast tradition across Europe and America. French technique of high-heat roasting creates crispy skin.',
                traditionally: 'A test of cooking skill. "If you can roast a chicken, you can cook." Leftovers used for soup and sandwiches.',
                pronunciation: 'rohst chik-in'
            },
            'Bibimbap': {
                context: 'Korean mixed rice bowl. Name means "mixed rice." Originally a way to use leftover banchan (side dishes).',
                traditionally: 'Served in hot stone bowl (dolsot) that creates crispy rice at bottom. Mix everything together before eating!',
                pronunciation: 'bee-beem-bahp'
            },
            'Coq au Vin': {
                context: 'French farmhouse dish means "rooster in wine." Peasants used tough old roosters, slow-braised until tender.',
                traditionally: 'Made with Burgundy wine and pearl onions. Julia Child popularized it in America. Tastes better the next day!',
                pronunciation: 'kohk oh van'
            },
            'Guacamole': {
                context: 'Aztec dish dating back to 1500s. Name from Nahuatl "āhuacamolli" (avocado sauce).',
                traditionally: 'Made in molcajete (volcanic stone mortar). Lime juice added immediately to prevent browning. Eaten same day.',
                pronunciation: 'gwah-kah-moh-leh'
            },
            'Northern Chinese Dumplings': {
                context: 'Jiaozi are eaten at Chinese New Year for prosperity (shape resembles gold ingots). Northern staple food.',
                traditionally: 'Families gather to make hundreds together. The pleats show skill. Boiled, steamed, or pan-fried (potstickers).',
                pronunciation: 'jee-ow-dzuh'
            },
            'Tom Yum Soup': {
                context: 'Thailand\'s famous hot and sour soup. "Tom" means boil, "yum" means mix. Central Thai cuisine.',
                traditionally: 'The aromatics (lemongrass, galangal, lime leaves) are for flavor only—not meant to be eaten. Balance of hot, sour, salty.',
                pronunciation: 'tom yoom'
            },
            'Spaghetti Carbonara': {
                context: 'Roman pasta dish likely named after carbonari (charcoal workers). No cream in authentic version—it\'s a modern addition!',
                traditionally: 'Made with guanciale (cured pork jowl), not bacon. The eggs create a silky sauce from pasta heat and starch water. Speed is key!',
                pronunciation: 'spah-get-tee kar-boh-nah-rah'
            },
            'Chicken Tikka Masala': {
                context: 'Created in 1960s Britain, likely by Bangladeshi chefs in Glasgow or London. Now considered Britain\'s national dish, blending Indian spices with British tastes.',
                traditionally: 'Chicken is marinated in yogurt and spices, then grilled in a tandoor oven before being added to the creamy tomato sauce. Served with naan bread or basmati rice.',
                pronunciation: 'chik-in tik-ah mah-sah-lah'
            },
            'Bibimbap': {
                context: 'Korean mixed rice bowl dating back to the Joseon Dynasty. Name means "mixed rice." Originally a way to use leftover banchan (side dishes).',
                traditionally: 'Served in hot stone bowl (dolsot) that creates crispy rice at bottom. Mix everything together with gochujang before eating—it\'s meant to be messy!',
                pronunciation: 'bee-beem-bahp'
            },
            'Pad See Ew': {
                context: 'Thai-Chinese stir-fried noodle dish popular in Bangkok street food scene. Influenced by Teochew immigrants from southern China.',
                traditionally: 'Cooked over extremely high heat (wok hei) to create slight char on noodles. The dark soy sauce creates signature caramelized color. Never use chopsticks—eat with fork and spoon!',
                pronunciation: 'pad see ay-ow'
            },
            'Vietnamese Pho Bo': {
                context: 'Vietnam\'s national dish originated in early 20th century Hanoi, influenced by French beef culture during colonial period. The clear, aromatic broth is simmered for hours.',
                traditionally: 'Eaten for breakfast. Diners customize with plate of fresh herbs (Thai basil, cilantro, mint), lime wedges, chilies, and hoisin sauce at the table.',
                pronunciation: 'fuh baw'
            },
            'Japanese Chicken Teriyaki': {
                context: 'Teriyaki means "glossy grilled" (teri = luster, yaki = grilled). Traditional Japanese technique that became popular worldwide, especially in America.',
                traditionally: 'Fish was originally more common than chicken. The sauce should be shiny and slightly caramelized, never thick and gloppy like bottled versions.',
                pronunciation: 'teh-ree-yah-kee'
            },
            'Cantonese Char Siu': {
                context: 'Hong Kong BBQ pork with history dating back centuries. Traditionally cooked hanging in special ovens, the name means "fork-roasted."',
                traditionally: 'Sold by weight in Cantonese roast meat shops. The red color comes from red fermented tofu or food coloring. Eaten over rice or in buns (char siu bao).',
                pronunciation: 'char see-oo'
            },
            'Singapore Laksa': {
                context: 'Peranakan dish blending Chinese and Malay influences. Singapore\'s version is creamier and spicier than Malaysian laksa lemak.',
                traditionally: 'Street hawker food served in large bowls. The curry laksa paste is laboriously made from scratch with dried shrimp, chilies, and aromatic spices.',
                pronunciation: 'luk-sah'
            },
            'Filipino Chicken Adobo': {
                context: 'The unofficial national dish of the Philippines. Pre-dates Spanish colonization—the vinegar preservation method was indigenous, Spanish just gave it the name "adobo."',
                traditionally: 'Each family has their own recipe ratio of soy sauce to vinegar. Often cooked in large batches and improves over several days. The sauce is perfect poured over rice.',
                pronunciation: 'ah-doh-boh'
            },
            'Malaysian Nasi Lemak': {
                context: 'Malaysia\'s national dish, means "fatty rice" from the coconut milk. Originated as farmers\' breakfast, now eaten any time of day.',
                traditionally: 'Served wrapped in banana leaf. The fragrant rice cooked with pandan is the star. Must have sambal, anchovies, peanuts, cucumber, and egg.',
                pronunciation: 'nah-see leh-mahk'
            },
            'Indonesian Rendang': {
                context: 'Minangkabau ceremonial dish from West Sumatra, Indonesia. CNN named it the world\'s most delicious food in 2011. Cooked for weddings and important celebrations.',
                traditionally: 'Slow-cooked for hours until coconut milk completely reduces and caramelizes around the meat. Traditional rendang is quite dry, not saucy. Can last for weeks without refrigeration.',
                pronunciation: 'ren-dahng'
            },
            'Coq au Vin': {
                context: 'French farmhouse dish means "rooster in wine." Burgundian peasants used tough old roosters that needed long braising. Julia Child made it famous in America.',
                traditionally: 'Authentic version uses a whole rooster and Burgundy wine. The bird is flambéed with Cognac before braising. Pearl onions and bacon are essential. Tastes better the next day!',
                pronunciation: 'kohk oh van'
            },
            'Paella Valenciana': {
                context: 'Spain\'s most famous dish originated in Valencia\'s rice fields. Valencian workers cooked it outdoors over orange wood fires, using whatever was available—rabbit, snails, beans.',
                traditionally: 'Cooked in wide, shallow pan over open flame. The crispy bottom layer (socarrat) is prized. NEVER stirred once rice is added! Traditionally eaten directly from the pan.',
                pronunciation: 'pah-eh-yah vah-len-thee-ah-nah'
            },
            'Beef Goulash': {
                context: 'Hungarian national dish dating to 9th century Magyar shepherds. The word comes from "gulyás" meaning herdsman. Originally a soup made in kettles over open fires.',
                traditionally: 'Authentic goulash is a soup, not a stew. Hungarian paprika is essential—it defines the dish. Eaten with small egg noodles (csipetke) or crusty bread.',
                pronunciation: 'goo-lahsh'
            },
            'Moussaka': {
                context: 'Greek comfort food with Middle Eastern roots. The modern layered version with béchamel was created by Greek-French chef Nikolaos Tselementes in the 1920s.',
                traditionally: 'Each layer is cooked separately before assembling. The creamy béchamel top is signature to Greek version. Must rest after baking or it falls apart when sliced.',
                pronunciation: 'moo-sah-kah'
            },
            'Osso Buco': {
                context: 'Milanese braised veal shanks, the name means "bone with a hole." The marrow inside the bone is considered the delicacy—traditionally eaten with a special spoon.',
                traditionally: 'Always served with gremolata (lemon zest, garlic, parsley) sprinkled on top. Traditionally paired with risotto alla milanese (saffron risotto). The veal must be cross-cut to show the marrow.',
                pronunciation: 'oh-so boo-ko'
            },
            'Boeuf Bourguignon': {
                context: 'Classic French beef stew from Burgundy region. Peasant dish that became haute cuisine. Made famous globally by Julia Child in the 1960s.',
                traditionally: 'Must use Burgundy wine—preferably the same wine you\'ll drink with dinner. Beef is marinated overnight in wine. Bacon lardons, pearl onions, and mushrooms are traditional. Improves after a day or two.',
                pronunciation: 'buff boor-gee-nyon'
            },
            'Irish Beef Stew': {
                context: 'Hearty peasant dish using Ireland\'s abundant beef, potatoes, and Guinness. Traditionally made on St. Patrick\'s Day and cold winter nights.',
                traditionally: 'Irish stout adds deep, malty richness. Potatoes thicken the stew naturally as they break down. Served with soda bread for soaking up the rich gravy.',
                pronunciation: 'eye-rish beef stew'
            },
            'Wiener Schnitzel': {
                context: 'Austria\'s national dish, "Wiener" means Viennese. Possibly brought from Milan in the 1800s. By law in Austria, real Wiener Schnitzel must be made with veal.',
                traditionally: 'The meat is pounded very thin, creating maximum crispy surface. Served with lemon wedge, lingonberry jam, and potato salad. Butter, not oil, is traditional for frying.',
                pronunciation: 'vee-ner shnit-sel'
            },
            'Swedish Meatballs': {
                context: 'Köttbullar are a staple of Swedish home cooking. Possibly inspired by Turkish meatballs brought back by King Charles XII in the early 1700s.',
                traditionally: 'Made with mix of beef and pork. Served with lingonberry jam, cream gravy, and mashed potatoes. Essential at Christmas smorgasbord. IKEA has made them world-famous.',
                pronunciation: 'churrt-bool-ar'
            },
            'Ratatouille': {
                context: 'Provençal vegetable stew from southern France. Made famous by peasant farmers using summer vegetables. The Pixar movie brought it global fame.',
                traditionally: 'Each vegetable is traditionally cooked separately then combined to preserve individual flavors. Can be rustic or elegantly arranged. Best enjoyed at room temperature the next day.',
                pronunciation: 'rah-tah-too-ee'
            },
            'Mole Poblano': {
                context: 'Complex Mexican sauce from Puebla with over 20 ingredients including chocolate and chilies. Legend says it was invented by nuns in the 17th century to impress a visiting archbishop.',
                traditionally: 'Reserved for special occasions like weddings and Day of the Dead. The chocolate adds depth, not sweetness. Each family guards their secret mole recipe. Can take days to prepare authentically.',
                pronunciation: 'moh-leh poh-blah-noh'
            },
            'Feijoada': {
                context: 'Brazil\'s national dish, a hearty black bean stew with various pork cuts. Created by enslaved Africans using discarded meat parts, now a beloved weekend feast.',
                traditionally: 'Served on Saturdays (Feijoada Saturday is a tradition). Eaten with rice, farofa (toasted cassava flour), collard greens, and orange slices. The meal can last hours.',
                pronunciation: 'fay-zhwah-dah'
            },
            'Peruvian Ceviche': {
                context: 'Peru\'s national dish, fish "cooked" in citrus juice. Ancient technique used by coastal indigenous peoples. Lima is considered the ceviche capital of the world.',
                traditionally: 'Marinated only 10-15 minutes—longer makes fish mushy. The marinade (leche de tigre) is so revered it\'s drunk as a hangover cure. Served ice cold with sweet potato and giant corn.',
                pronunciation: 'seh-vee-cheh'
            },
            'Argentine Empanadas': {
                context: 'Portable pastries brought by Spanish colonizers, now quintessentially Argentine. Each province has its own filling and folding style—you can tell where someone is from by their empanadas.',
                traditionally: 'The repulgue (crimped edge) shows the cook\'s skill. Meat empanadas have olives and hard-boiled eggs. Baked in Córdoba, fried in Salta. Essential at every celebration.',
                pronunciation: 'em-pah-nah-dahs'
            },
            'Cuban Ropa Vieja': {
                context: 'Cuba\'s national dish, name means "old clothes" because the shredded meat resembles tattered fabric. Legend says a poor man shredded his clothes to feed his family, and they turned into this stew.',
                traditionally: 'Part of a traditional Cuban meal with black beans, rice, and fried plantains. The meat should fall apart easily. Often cooked in large batches for family gatherings.',
                pronunciation: 'roh-pah vee-eh-hah'
            },
            'Chilean Pastel de Choclo': {
                context: 'Chilean summer comfort food, a savory-sweet casserole with corn topping. "Pastel" means pie, "choclo" is indigenous word for corn. Pre-dates Spanish colonization.',
                traditionally: 'Served in individual clay dishes called paila. The corn topping should be slightly sweet and caramelized. Eaten with a spoon—it\'s meant to be soft and comforting.',
                pronunciation: 'pahs-tel deh choh-kloh'
            },
            'Colombian Ajiaco': {
                context: 'Bogotá\'s signature soup made with three types of potatoes and Colombian herb guascas. A pre-Columbian dish that evolved during Spanish colonial period.',
                traditionally: 'Served on cold Bogotá days. The three potato varieties create different textures—some dissolve to thicken, others stay whole. Customized at the table with cream, capers, and avocado.',
                pronunciation: 'ah-hee-ah-koh'
            },
            'Ecuadorian Encebollado': {
                context: 'Ecuador\'s national dish from coastal regions. A tangy fish soup traditionally eaten as a hangover cure after a night of drinking.',
                traditionally: 'Made with fresh albacore tuna and yuca. The pickled red onions are essential for bright acidity. Topped with popcorn for crunch—a uniquely Ecuadorian touch!',
                pronunciation: 'en-seh-boh-yah-doh'
            },
            'Venezuelan Pabellón Criollo': {
                context: 'Venezuela\'s national dish represents the country\'s mixed heritage. The colors symbolize the Venezuelan flag and different ethnic groups: white rice (Europeans), black beans (Africans), shredded beef (indigenous).',
                traditionally: 'Each component is served separately on the plate like a flag. Fried plantains represent gold/wealth. Eaten by mixing everything together. Sunday family meal tradition.',
                pronunciation: 'pah-beh-yohn kree-oh-yoh'
            },
            'Tacos al Pastor': {
                context: 'Mexican adaptation of Lebanese shawarma brought by Middle Eastern immigrants in the 1900s. Mexico City\'s most iconic street food, vertical spit-roasted meat invented in Puebla.',
                traditionally: 'Served on small corn tortillas with pineapple, cilantro, and onion. The taquero (taco maker) slices meat directly onto tortillas with theatrical flair. Pineapple on top bastes the meat while cooking.',
                pronunciation: 'tah-kohs ahl pahs-tohr'
            },
            'Lebanese Kibbeh': {
                context: 'Lebanon\'s national dish, bulgur and meat croquettes that date back centuries. The skill of making paper-thin shells filled with spiced meat shows a cook\'s expertise.',
                traditionally: 'Served at every celebration and holiday. Can be baked in a pan (kibbeh bil sanieh), fried (kibbeh maqliyeh), or eaten raw (kibbeh nayeh). The torpedo shape with pointed ends is traditional.',
                pronunciation: 'kib-beh'
            },
            'Persian Ghormeh Sabzi': {
                context: 'Iran\'s national dish, an herb stew that\'s considered the ultimate test of a Persian cook. The name means "braised herbs." Origins trace back to ancient Persia.',
                traditionally: 'Made for Persian New Year (Nowruz). The herbs must be fresh and chopped by hand. Dried limes (limu omani) add signature sour tang. Tastes even better after a few days.',
                pronunciation: 'ghor-meh sahb-zee'
            },
            'Turkish Menemen': {
                context: 'Turkish scrambled eggs with tomatoes and peppers, a beloved breakfast dish. Simple peasant food that\'s become a brunch favorite across Turkey.',
                traditionally: 'Cooked and served in individual copper pans. The eggs should remain soft and creamy, never dry. Eaten by scooping with crusty bread. Essential hangover cure.',
                pronunciation: 'meh-neh-men'
            },
            'Moroccan Tagine': {
                context: 'Named after the conical clay pot it\'s cooked in. Slow-cooking method used by Berber nomads for centuries. The cone shape traps steam, creating self-basting effect.',
                traditionally: 'Cooked over charcoal braziers. Preserved lemons and olives are signature to Moroccan version. Eaten communally—everyone eats from the same tagine using bread.',
                pronunciation: 'tah-jeen'
            },
            'Iraqi Masgouf': {
                context: 'Iraq\'s national dish, grilled carp that dates back to ancient Mesopotamia—possibly the oldest continuously prepared dish in the world, over 5,000 years old.',
                traditionally: 'Butterflied fish is propped up on stakes around open fire on Baghdad\'s riverbanks. Tamarind gives it signature tang. Traditionally eaten with the hands while sitting on carpets by the Tigris River.',
                pronunciation: 'mahs-goof'
            },
            'Palestinian Musakhan': {
                context: 'Palestine\'s national dish, roasted chicken with sumac on taboon bread. Originally a peasant dish using olive oil from the harvest season.',
                traditionally: 'The chicken and onions are piled on flatbread that soaks up all the juices. Eaten with hands, family-style. The sumac-caramelized onions are considered the best part.',
                pronunciation: 'moo-sah-hahn'
            },
            'Syrian Fattet Hummus': {
                context: 'Layered Damascene dish meaning "crumbled" for the broken pita. A breakfast or light dinner dish that showcases the Syrian love of contrasting textures.',
                traditionally: 'Assembled at the last minute so pita stays crispy. Eaten with a spoon, mixing the layers together. Often served at celebrations and holidays.',
                pronunciation: 'fat-teh hoo-moos'
            },
            'Emirati Machboos': {
                context: 'UAE\'s national dish, spiced rice with meat similar to biryani. Reflects the Gulf\'s historical trade connections with India and Persia. Each emirate has slight variations.',
                traditionally: 'Cooked for celebrations and Eid. The rice absorbs all the spiced meat juices. Traditionally served on large communal platters, eaten with the right hand.',
                pronunciation: 'mahk-boos'
            },
            'Yemeni Saltah': {
                context: 'Yemen\'s national dish, a bubbling meat stew topped with fenugreek foam. The foam (hulba) is unique to Yemeni cuisine and requires skill to whip properly.',
                traditionally: 'Served in individual stone bowls that keep it piping hot. Eaten with flatbread used to scoop. The fenugreek foam should be light and airy on top.',
                pronunciation: 'sahl-tah'
            },
            'Jordanian Mansaf': {
                context: 'Jordan\'s national dish, Bedouin feast of lamb in fermented yogurt sauce. The ultimate hospitality dish—refusing mansaf is offensive. Historically prepared for honored guests.',
                traditionally: 'Eaten from a large communal platter. Tradition is to use only the right hand, forming rice and meat into balls. The jameed (dried yogurt) gives unique tangy flavor. Saved for special occasions.',
                pronunciation: 'mahn-sahf'
            },
            'Ethiopian Doro Wat': {
                context: 'Ethiopia\'s beloved spicy chicken stew, considered the national dish. Central to Ethiopian Orthodox celebrations, especially Easter. The berbere spice blend defines Ethiopian cuisine.',
                traditionally: 'Served on injera (spongy sourdough flatbread) that acts as both plate and utensil. Hard-boiled eggs are symbolic. Eaten with hands, tearing off injera to scoop stew. Coffee ceremony follows.',
                pronunciation: 'doh-roh wot'
            },
            'Nigerian Jollof Rice': {
                context: 'West Africa\'s most famous dish sparks fierce debate—Ghana, Nigeria, and Senegal all claim the best version. Each country\'s recipe is a source of intense national pride.',
                traditionally: 'Essential at parties, weddings, and celebrations—no Nigerian party is complete without it. The smoky, slightly burnt bottom (called "party rice") is the most prized part.',
                pronunciation: 'joh-lof rice'
            },
            'Senegalese Thieboudienne': {
                context: 'Senegal\'s national dish, considered the origin of all Jollof rice variations. Created in the 19th century by Penda Mbaye in Saint-Louis. UNESCO Intangible Cultural Heritage.',
                traditionally: 'Served from a large communal platter. The nokoss (parsley-stuffed fish) is the star. The crispy burnt rice at the bottom (xoon) is saved for the most honored guests.',
                pronunciation: 'cheb-oo-jen'
            },
            'South African Bobotie': {
                context: 'Cape Malay comfort food brought by Indonesian and Malaysian slaves in the 1600s. The name likely comes from Indonesian "bobotok." Reflects South Africa\'s complex colonial history.',
                traditionally: 'Served with yellow rice cooked with raisins and turmeric, sambals, chutney, and sliced banana. The sweet-savory flavor profile is characteristic of Cape Malay cooking.',
                pronunciation: 'bah-boor-tea'
            },
            'Ghanaian Groundnut Soup': {
                context: 'Beloved West African peanut soup that crosses borders—eaten from Ghana to Nigeria to Mali. Peanuts were brought from South America but became integral to West African cuisine.',
                traditionally: 'Served with fufu (pounded cassava or plantain). Diners pinch off fufu pieces and dip into soup. The peanut butter creates rich, silky texture. Comfort food for rainy days.',
                pronunciation: 'ground-nut soup'
            },
            'Kenyan Nyama Choma': {
                context: 'Kenya\'s favorite social food, name means "grilled meat" in Swahili. Not just food but a social event—friends gather at outdoor grills (nyama choma joints) on weekends.',
                traditionally: 'Goat is most traditional, grilled over charcoal. Served with kachumbari (tomato-onion salad) and ugali (cornmeal). Eaten with hands. Beer is essential accompaniment.',
                pronunciation: 'nyah-mah choh-mah'
            },
            'Tunisian Shakshuka': {
                context: 'North African baked eggs in spicy tomato sauce. Brought to Israel by Tunisian Jews in the 1950s, where it became a national breakfast dish. Now popular worldwide.',
                traditionally: 'Cooked and served in the same pan (often cast iron). Eaten directly from the pan with bread for dipping. Each region adds local touches—merguez sausage, preserved lemon, feta.',
                pronunciation: 'shahk-shoo-kah'
            },
            'Cambodian Amok Trey': {
                context: 'Cambodia\'s national dish, steamed fish curry in banana leaves. Ancient Khmer recipe that survived the tragic Khmer Rouge period when much culinary knowledge was lost.',
                traditionally: 'Traditionally steamed in banana leaf cups. The coconut custard should be silky and delicate. Reserved for celebrations and temple offerings. Eaten with jasmine rice.',
                pronunciation: 'ah-mok tray'
            },
            'Jamaican Jerk Chicken': {
                context: 'Jamaica\'s signature dish dating back to indigenous Taíno people and African Maroons who preserved meat with spices. The smoking technique was developed by escaped slaves hiding in the mountains.',
                traditionally: 'Cooked over pimento wood (allspice tree) for authentic flavor. Roadside jerk stands use halved oil drums as smokers. The scotch bonnet heat and allspice warmth define true jerk.',
                pronunciation: 'jerk chik-in'
            },
            'Australian Meat Pie': {
                context: 'Australia\'s national snack, sold at bakeries, gas stations, and sporting events. British immigrants brought the tradition, but Aussies made it their own—over 270 million sold annually.',
                traditionally: 'Eaten at football matches, often with tomato sauce squirted on top. Held in a paper bag to catch drips. The "pie floater" (pie floating in pea soup) is a South Australian delicacy.',
                pronunciation: 'meat pie'
            }
        };
        
        const info = contexts[recipe.name];
        if (!info) return '';
        
        return `
            <div style="
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-top: 16px;
            ">
                <div style="font-size: 14px; font-weight: 700; opacity: 0.95; margin-bottom: 8px;">
                    📚 Cultural Context
                </div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; line-height: 1.5;">
                    ${info.context}
                </div>
                <div style="font-size: 13px; opacity: 0.85; font-style: italic; margin-bottom: 8px; line-height: 1.4;">
                    <strong>Traditionally:</strong> ${info.traditionally}
                </div>
                ${info.pronunciation ? `
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 6px;
                        padding: 6px 10px;
                        font-size: 12px;
                        opacity: 0.9;
                        display: inline-block;
                    ">
                        🗣️ Pronunciation: <strong>${info.pronunciation}</strong>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // Show substitution finder
    showSubstitutionFinder: function(recipeId) {
        const recipe = recipes.getRecipeById(recipeId);
        if (!recipe) return;
        
        const modal = document.createElement('div');
        modal.id = 'substitution-finder-modal';
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
            z-index: 2000;
            overflow-y: auto;
            padding: 24px;
        `;
        
        const ingredientsWithSubs = recipe.ingredients
            .map(ing => ({
                ...ing,
                substitutions: substitutions.find(ing.name)
            }))
            .filter(ing => ing.substitutions);
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 32px;
                position: relative;
            ">
                <button onclick="document.getElementById('substitution-finder-modal').remove()" style="
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
                
                <h2 style="color: var(--text-primary); margin-bottom: 8px;">🔄 Ingredient Substitutions</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">
                    Out of an ingredient? Here are substitutes for ${recipe.name}
                </p>
                
                ${ingredientsWithSubs.length === 0 ? `
                    <div class="card card-light" style="text-align: center; padding: 48px;">
                        <p style="color: var(--text-secondary); font-size: 16px;">
                            No common substitutions found for ingredients in this recipe.
                        </p>
                    </div>
                ` : ingredientsWithSubs.map(ing => `
                    <div class="card card-light" style="margin-bottom: 16px;">
                        <h4 style="color: var(--text-primary); margin-bottom: 12px; font-size: 16px;">
                            ${ing.name.charAt(0).toUpperCase() + ing.name.slice(1)}
                        </h4>
                        ${ing.substitutions.map((sub, index) => `
                            <div style="
                                background: white;
                                border: 2px solid var(--orange-light);
                                border-radius: 8px;
                                padding: 12px;
                                margin-bottom: ${index < ing.substitutions.length - 1 ? '8px' : '0'};
                            ">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                                    <strong style="color: var(--orange-main);">→ ${sub.substitute}</strong>
                                    <span style="
                                        background: var(--orange-lightest);
                                        color: var(--orange-dark);
                                        padding: 2px 8px;
                                        border-radius: 12px;
                                        font-size: 12px;
                                        font-weight: 600;
                                    ">${sub.ratio}</span>
                                </div>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
                                    💡 ${sub.note}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                
                <div style="margin-top: 24px; text-align: center;">
                    <button class="btn btn-primary" onclick="document.getElementById('substitution-finder-modal').remove()">
                        Got It!
                    </button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    },
    
    // Show add to collection modal
    showAddToCollectionModal: function(recipeId) {
        const collections = userData.getCollections();
        
        const modal = document.createElement('div');
        modal.id = 'add-to-collection-modal';
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
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; max-width: 500px; width: 90%; padding: 32px; position: relative; max-height: 80vh; overflow-y: auto;">
                <button onclick="document.getElementById('add-to-collection-modal').remove()" style="
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
                
                <h2 style="color: var(--text-primary); margin-bottom: 8px;">Add to Collection</h2>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">
                    Choose which collection to add this recipe to
                </p>
                
                ${collections.length === 0 ? `
                    <div style="text-align: center; padding: 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📁</div>
                        <p style="color: var(--text-secondary); margin-bottom: 16px;">
                            You don't have any collections yet
                        </p>
                        <button class="btn btn-primary" onclick="document.getElementById('add-to-collection-modal').remove(); app.showPage('collections')">
                            Create Your First Collection
                        </button>
                    </div>
                ` : `
                    ${collections.map(collection => {
                        const isInCollection = collection.recipeIds.includes(recipeId);
                        return `
                            <div style="
                                border: 2px solid ${isInCollection ? 'var(--orange-main)' : 'var(--orange-light)'};
                                background: ${isInCollection ? 'var(--orange-lightest)' : 'white'};
                                border-radius: 8px;
                                padding: 16px;
                                margin-bottom: 12px;
                                cursor: pointer;
                                transition: all 0.2s;
                            " onclick="cookingMode.toggleRecipeInCollection('${collection.id}', '${recipeId}')">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="font-size: 32px;">${collection.icon}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">
                                            ${collection.name}
                                        </div>
                                        <div style="font-size: 13px; color: var(--text-secondary);">
                                            ${collection.recipeIds.length} recipes
                                        </div>
                                    </div>
                                    ${isInCollection ? '<div style="color: var(--orange-main); font-size: 20px;">✓</div>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                `}
                
                <div style="margin-top: 24px; text-align: center;">
                    <button class="btn btn-secondary" onclick="document.getElementById('add-to-collection-modal').remove()">
                        Done
                    </button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
    },
    
    // Toggle recipe in collection
    toggleRecipeInCollection: function(collectionId, recipeId) {
        const collections = userData.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        
        if (!collection) return;
        
        if (collection.recipeIds.includes(recipeId)) {
            userData.removeFromCollection(collectionId, recipeId);
        } else {
            userData.addToCollection(collectionId, recipeId);
        }
        
        // Refresh modal
        document.getElementById('add-to-collection-modal').remove();
        this.showAddToCollectionModal(recipeId);
    }
};
