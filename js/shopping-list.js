/* ===================================
   SHOPPING-LIST.JS - Smart Shopping Lists
   =================================== */

const shoppingList = {
    currentList: null,
    
    // Generate shopping list from weekly plan
    generate: function() {
        console.log('🛒 Generating shopping list...');
        
        const plan = userData.getWeeklyPlan();
        if (!plan || plan.length === 0) {
            console.warn('No weekly plan found');
            return null;
        }
        
        const household = userData.data.household || 2;
        const allIngredients = [];
        
        // Collect all ingredients from the week
        plan.forEach(dayPlan => {
            const recipe = dayPlan.recipe;
            const baseServings = recipe.servings.base;
            const scaleFactor = household / baseServings;
            
            recipe.ingredients.forEach(ing => {
                allIngredients.push({
                    name: ing.name,
                    amount: ing.amount * scaleFactor,
                    unit: ing.unit,
                    category: ing.category,
                    preparation: ing.preparation,
                    recipe: recipe.name
                });
            });
        });
        
        // Consolidate duplicates
        const consolidated = this.consolidateIngredients(allIngredients);
        
        // Organize by category
        const organized = this.organizeByCategory(consolidated);
        
        this.currentList = organized;
        
        console.log('✅ Shopping list generated:', organized);
        return organized;
    },
    
    // Consolidate duplicate ingredients
    consolidateIngredients: function(ingredients) {
        const map = new Map();
        
        ingredients.forEach(ing => {
            const key = `${ing.name}-${ing.unit}`;
            
            if (map.has(key)) {
                const existing = map.get(key);
                existing.amount += ing.amount;
                existing.recipes.push(ing.recipe);
            } else {
                map.set(key, {
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit,
                    category: ing.category,
                    preparation: ing.preparation,
                    recipes: [ing.recipe]
                });
            }
        });
        
        return Array.from(map.values());
    },
    
    // Organize ingredients by category
    organizeByCategory: function(ingredients) {
        const pantryStaples = userData.getPantryStaples();
        const categories = {
            'protein': [],
            'vegetables': [],
            'fruits': [],
            'grains': [],
            'dairy': [],
            'spice': [],
            'sauce': [],
            'aromatics': [],
            'cooking': [],
            'other': []
        };
        
        const skippedPantryItems = [];
        
        ingredients.forEach(ing => {
            // Check if this is a pantry staple
            if (userData.hasPantryStaple(ing.name)) {
                skippedPantryItems.push(ing.name);
                return; // Skip adding to shopping list
            }
            
            const category = ing.category || 'other';
            if (categories[category]) {
                categories[category].push(ing);
            } else {
                categories['other'].push(ing);
            }
        });
        
        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].length === 0) {
                delete categories[key];
            }
        });
        
        // Store skipped items for display
        this.skippedPantryItems = [...new Set(skippedPantryItems)];
        
        return categories;
    },
    
    // Generate and show shopping list
    generateAndShow: function() {
        const list = this.generate();
        if (!list) {
            alert('Please generate a weekly meal plan first!');
            return;
        }
        
        this.show();
    },
    
    // Show shopping list in modal/page
    show: function() {
        if (!this.currentList) {
            this.generate();
        }
        
        const modal = this.createShoppingListModal();
        document.body.appendChild(modal);
    },
    
    // Create shopping list modal
    createShoppingListModal: function() {
        const modal = document.createElement('div');
        modal.id = 'shopping-list-modal';
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
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 32px;
                position: relative;
            ">
                <button onclick="shoppingList.closeModal()" style="
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
                
                <h2 style="color: var(--text-primary); margin-bottom: 16px;">🛒 Shopping List</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                    Optimized for your weekly meal plan
                </p>
                
                ${this.renderPantryStaplesInfo()}
                
                ${this.renderShoppingListContent()}
                
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button class="btn btn-primary" onclick="shoppingList.print()">
                        🖨️ Print List
                    </button>
                    <button class="btn btn-secondary" onclick="shoppingList.copyToClipboard()">
                        📋 Copy to Clipboard
                    </button>
                    <button class="btn btn-secondary" onclick="shoppingList.emailList()">
                        📧 Email to Me
                    </button>
                </div>
            </div>
        `;
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        return modal;
    },
    
    // Render shopping list content
    renderShoppingListContent: function() {
        const categoryLabels = {
            'protein': '🥩 Proteins',
            'vegetables': '🥬 Vegetables',
            'fruits': '🍎 Fruits',
            'grains': '🌾 Grains & Pasta',
            'dairy': '🥛 Dairy',
            'spice': '🌶️ Spices & Herbs',
            'sauce': '🥫 Sauces & Condiments',
            'aromatics': '🧄 Aromatics',
            'cooking': '🫒 Cooking Oils & Basics',
            'other': '📦 Other'
        };
        
        let html = '';
        
        Object.entries(this.currentList).forEach(([category, items]) => {
            html += `
                <div style="margin-bottom: 24px;">
                    <h3 style="
                        color: var(--orange-main);
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid var(--orange-lightest);
                    ">
                        ${categoryLabels[category] || category}
                    </h3>
                    
                    ${items.map(item => `
                        <div class="checkbox-container" style="
                            padding: 8px 0;
                            border-bottom: 1px solid var(--orange-lightest);
                        ">
                            <input type="checkbox" id="item-${item.name.replace(/\s/g, '-')}">
                            <label for="item-${item.name.replace(/\s/g, '-')}" style="
                                flex: 1;
                                cursor: pointer;
                                color: var(--text-primary);
                            ">
                                <strong>${this.formatAmount(item.amount, item.unit)}</strong> 
                                ${item.name}
                                ${item.preparation ? `<em style="color: var(--text-secondary); font-size: 13px;"> (${item.preparation})</em>` : ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
            `;
        });
        
        return html;
    },
    
    // Format ingredient amount
    formatAmount: function(amount, unit) {
        // Round to reasonable precision
        let rounded = amount;
        
        if (amount < 0.125) {
            rounded = Math.round(amount * 16) / 16; // To nearest 1/16
        } else if (amount < 1) {
            rounded = Math.round(amount * 4) / 4; // To nearest 1/4
        } else if (amount < 10) {
            rounded = Math.round(amount * 2) / 2; // To nearest 1/2
        } else {
            rounded = Math.round(amount);
        }
        
        // Convert decimals to fractions for readability
        const fractions = {
            0.25: '¼',
            0.5: '½',
            0.75: '¾',
            0.125: '⅛',
            0.375: '⅜',
            0.625: '⅝',
            0.875: '⅞'
        };
        
        const whole = Math.floor(rounded);
        const decimal = rounded - whole;
        
        let display = '';
        if (whole > 0) display += whole;
        if (decimal > 0 && fractions[decimal]) {
            display += (whole > 0 ? ' ' : '') + fractions[decimal];
        } else if (decimal > 0) {
            display = rounded.toFixed(2);
        }
        
        return `${display} ${unit}`.trim();
    },
    
    // Close modal
    closeModal: function() {
        const modal = document.getElementById('shopping-list-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // Render pantry staples info
    renderPantryStaplesInfo: function() {
        const skipped = this.skippedPantryItems || [];
        
        let html = `
            <div style="
                background: #E0F2FE;
                border: 2px solid #0EA5E9;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 16px;
                font-size: 14px;
                color: #0369A1;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>✓ Pantry Staples:</strong> ${skipped.length} items skipped (you have these!)
                    </div>
                    <button onclick="shoppingList.showPantryManager()" style="
                        background: white;
                        border: 2px solid #0EA5E9;
                        border-radius: 9999px;
                        padding: 4px 12px;
                        font-size: 12px;
                        font-weight: 600;
                        color: #0369A1;
                        cursor: pointer;
                    ">Manage Pantry</button>
                </div>
        `;
        
        if (skipped.length > 0) {
            html += `
                <div style="margin-top: 8px; font-size: 13px;">
                    Skipped: ${skipped.join(', ')}
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    },
    
    // Show pantry manager
    showPantryManager: function() {
        this.closeModal();
        
        const modal = document.createElement('div');
        modal.id = 'pantry-manager-modal';
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
        
        const pantryStaples = userData.getPantryStaples();
        const commonItems = [
            'salt', 'black pepper', 'white pepper', 'vegetable oil', 'olive oil', 
            'butter', 'garlic', 'onion', 'soy sauce', 'sugar', 'flour', 
            'rice', 'pasta', 'eggs', 'milk', 'sesame oil', 'vinegar',
            'cornstarch', 'baking powder', 'vanilla extract'
        ];
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 32px;
                position: relative;
            ">
                <button onclick="document.getElementById('pantry-manager-modal').remove()" style="
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
                
                <h2 style="color: var(--text-primary); margin-bottom: 8px;">🏺 Pantry Staples</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                    Check items you always have on hand. They'll be skipped in shopping lists.
                </p>
                
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 12px;">Common Items</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        ${commonItems.map(item => `
                            <div class="checkbox-container" style="padding: 8px; border-radius: 8px; background: var(--orange-lightest);">
                                <input type="checkbox" id="pantry-${item.replace(/\s/g, '-')}" 
                                    ${pantryStaples.includes(item.toLowerCase()) ? 'checked' : ''}
                                    onchange="shoppingList.togglePantryItem('${item}', this.checked)">
                                <label for="pantry-${item.replace(/\s/g, '-')}" style="cursor: pointer; color: var(--text-primary);">
                                    ${item.charAt(0).toUpperCase() + item.slice(1)}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 12px;">Add Custom Item</h4>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="custom-pantry-item" placeholder="e.g., honey, paprika" style="
                            flex: 1;
                            padding: 8px 12px;
                            border: 2px solid var(--orange-light);
                            border-radius: 8px;
                            font-size: 14px;
                        ">
                        <button onclick="shoppingList.addCustomPantryItem()" class="btn btn-primary btn-small">
                            Add
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 style="color: var(--text-primary); margin-bottom: 12px;">Your Custom Items</h4>
                    <div id="custom-pantry-list">
                        ${pantryStaples.filter(item => !commonItems.includes(item)).map(item => `
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 8px 12px;
                                background: var(--orange-lightest);
                                border-radius: 8px;
                                margin-bottom: 4px;
                            ">
                                <span style="color: var(--text-primary);">${item}</span>
                                <button onclick="shoppingList.removePantryItem('${item}')" style="
                                    background: transparent;
                                    border: none;
                                    color: var(--orange-dark);
                                    cursor: pointer;
                                    font-size: 18px;
                                ">×</button>
                            </div>
                        `).join('') || '<p style="color: var(--text-secondary); font-size: 14px;">No custom items yet</p>'}
                    </div>
                </div>
                
                <div style="margin-top: 24px; text-align: center;">
                    <button class="btn btn-primary" onclick="document.getElementById('pantry-manager-modal').remove(); shoppingList.generateAndShow();">
                        Done
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
    
    // Toggle pantry item
    togglePantryItem: function(item, isChecked) {
        if (isChecked) {
            userData.addPantryStaple(item);
        } else {
            userData.removePantryStaple(item);
        }
    },
    
    // Add custom pantry item
    addCustomPantryItem: function() {
        const input = document.getElementById('custom-pantry-item');
        const item = input.value.trim();
        
        if (!item) return;
        
        if (userData.addPantryStaple(item)) {
            input.value = '';
            // Refresh pantry manager
            this.showPantryManager();
        } else {
            alert('Item already in pantry!');
        }
    },
    
    // Remove pantry item
    removePantryItem: function(item) {
        if (confirm(`Remove "${item}" from pantry staples?`)) {
            userData.removePantryStaple(item);
            this.showPantryManager();
        }
    },
    
    // Print shopping list
    print: function() {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>Palate - Shopping List</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #FF7700; }
                    h2 { color: #994700; margin-top: 20px; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 8px 0; border-bottom: 1px solid #eee; }
                    .category { margin-bottom: 30px; }
                </style>
            </head>
            <body>
                <h1>🛒 Palate Shopping List</h1>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
                ${this.renderPrintableList()}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    },
    
    // Render printable list
    renderPrintableList: function() {
        const categoryLabels = {
            'protein': '🥩 Proteins',
            'vegetables': '🥬 Vegetables',
            'fruits': '🍎 Fruits',
            'grains': '🌾 Grains & Pasta',
            'dairy': '🥛 Dairy',
            'spice': '🌶️ Spices & Herbs',
            'sauce': '🥫 Sauces & Condiments',
            'aromatics': '🧄 Aromatics',
            'cooking': '🫒 Cooking Oils & Basics',
            'other': '📦 Other'
        };
        
        let html = '';
        
        Object.entries(this.currentList).forEach(([category, items]) => {
            html += `
                <div class="category">
                    <h2>${categoryLabels[category] || category}</h2>
                    <ul>
                        ${items.map(item => `
                            <li>☐ ${this.formatAmount(item.amount, item.unit)} ${item.name} ${item.preparation ? `(${item.preparation})` : ''}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        
        return html;
    },
    
    // Copy to clipboard
    copyToClipboard: function() {
        const categoryLabels = {
            'protein': 'PROTEINS',
            'vegetables': 'VEGETABLES',
            'fruits': 'FRUITS',
            'grains': 'GRAINS & PASTA',
            'dairy': 'DAIRY',
            'spice': 'SPICES & HERBS',
            'sauce': 'SAUCES & CONDIMENTS',
            'aromatics': 'AROMATICS',
            'cooking': 'COOKING OILS & BASICS',
            'other': 'OTHER'
        };
        
        let text = 'PALATE SHOPPING LIST\n';
        text += '===================\n\n';
        
        Object.entries(this.currentList).forEach(([category, items]) => {
            text += `${categoryLabels[category] || category.toUpperCase()}\n`;
            text += '---\n';
            items.forEach(item => {
                text += `☐ ${this.formatAmount(item.amount, item.unit)} ${item.name} ${item.preparation ? `(${item.preparation})` : ''}\n`;
            });
            text += '\n';
        });
        
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Shopping list copied to clipboard!');
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
        });
    },
    
    // Email shopping list
    emailList: function() {
        const categoryLabels = {
            'protein': 'PROTEINS',
            'vegetables': 'VEGETABLES',
            'fruits': 'FRUITS',
            'grains': 'GRAINS & PASTA',
            'dairy': 'DAIRY',
            'spice': 'SPICES & HERBS',
            'sauce': 'SAUCES & CONDIMENTS',
            'aromatics': 'AROMATICS',
            'cooking': 'COOKING OILS & BASICS',
            'other': 'OTHER'
        };
        
        // Build email body
        let body = 'PALATE SHOPPING LIST\n';
        body += '===================\n\n';
        body += `Generated: ${new Date().toLocaleDateString()}\n\n`;
        
        Object.entries(this.currentList).forEach(([category, items]) => {
            body += `${categoryLabels[category] || category.toUpperCase()}\n`;
            body += '---\n';
            items.forEach(item => {
                body += `☐ ${this.formatAmount(item.amount, item.unit)} ${item.name} ${item.preparation ? `(${item.preparation})` : ''}\n`;
            });
            body += '\n';
        });
        
        body += '\n---\nCreated with Palate - Personalized Meal Planning';
        
        // Create mailto link
        const subject = encodeURIComponent('My Palate Shopping List');
        const emailBody = encodeURIComponent(body);
        const mailtoLink = `mailto:?subject=${subject}&body=${emailBody}`;
        
        // Open email client
        window.location.href = mailtoLink;
    }
};
