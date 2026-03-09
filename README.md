# Palate 🍳

**Personalized meal planning that respects your equipment, time, skill level, and cultural preferences**

---

## 🌟 What Makes Palate Different

Unlike traditional recipe apps that just list recipes, Palate is built for **everyone** - whether you're a busy student with just a rice cooker, a gym enthusiast tracking macros, or a working parent juggling schedules. 

**Core Philosophy:**
- ✅ **No stereotypes** - We ask about your goals, not your demographic
- ✅ **Cultural respect** - Specific regional cuisines (Szechuan, not "Asian fusion")
- ✅ **Equipment-aware** - Recipes that work with what you actually have
- ✅ **Recipe progression** - Master basics before advanced techniques
- ✅ **Smart planning** - Buy 1 onion, not a whole bag

---

## 🚀 Quick Start

### Option 1: Simple File Opening (Recommended for testing)

1. Download the entire `palate-app` folder
2. Open `index.html` in your web browser
3. Start cooking! 🎉

**Note:** Some features (like loading recipes.json) require running from a server due to browser security restrictions.

### Option 2: Local Server (Recommended for full experience)

**Using Python:**
```bash
cd palate-app
python -m http.server 8000
# Then open: http://localhost:8000
```

**Using Node.js:**
```bash
cd palate-app
npx http-server
# Then open the URL shown in terminal
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 📁 File Structure

```
palate-app/
├── index.html              # Main entry point
├── css/
│   ├── base.css           # Reset, variables, typography
│   ├── layout.css         # Grid systems, responsive layouts
│   ├── components.css     # Reusable UI components
│   └── pages.css          # Page-specific styles
├── js/
│   ├── app.js            # Main application controller
│   ├── user-data.js      # User preferences & localStorage
│   ├── recipes.js        # Recipe management & filtering
│   ├── onboarding.js     # New user onboarding flow
│   ├── meal-plan.js      # Weekly meal plan generation
│   ├── shopping-list.js  # Smart shopping list creation
│   └── cooking-mode.js   # Revolutionary recipe display
└── data/
    └── recipes.json       # Recipe database (15 recipes to start)
```

---

## ✨ Features

### 🎯 Smart Onboarding
- **Goal-based setup** - What do you want to achieve?
  - Find delicious recipes
  - Eat healthier
  - Support fitness goals
  - Save time
  - Learn cooking skills
  - Cook on a budget
- **Household size** - Automatic portion scaling
- **Adventure level** - Comfort zone, balanced, or explorer
- **No assumptions** - We never stereotype based on age or profession

### 📅 Intelligent Weekly Meal Planning
- **Recipe progression**
  - 🆕 New recipes (you haven't tried)
  - 🔁 Repeat recipes (building skills)
  - ⭐ Mastered recipes (you've made 3+ times)
- **Cuisine diversity** - Visual distribution tracking
- **Adventure-based mixing**
  - Comfort: 5 repeats, 2 new
  - Balanced: 3 repeats, 4 new
  - Explorer: 1 repeat, 6 new

### 🛒 Smart Shopping Lists
- **Ingredient consolidation** - Combines duplicates across recipes
- **Category organization** - Proteins, vegetables, dairy, etc.
- **Quantity optimization** - Buy exactly what you need
- **Pantry awareness** - Reminds you to check existing items
- **Multiple formats** - Print, copy to clipboard, or digital checklist

### 👨‍🍳 Revolutionary Recipe Display
**Problem solved:** Traditional recipes bury ingredients in paragraphs and make you scroll constantly.

**Our solution:**
- ✅ **Sticky ingredients sidebar** - Always visible while you cook
- ✅ **Checkbox tracking** - Mark off as you prep
- ✅ **Step-by-step cards** - One step at a time, clear focus
- ✅ **Built-in timers** - Click to start, audio alert when done
- ✅ **Progress tracking** - Visual indication of where you are
- ✅ **Equipment substitutions** - Inline notes for alternatives
- ✅ **Portion scaling** - Automatic adjustment for household size

### 🔧 Equipment Intelligence
- **Filter by equipment** - Only see recipes you can make
- **Substitution suggestions** - "No wok? Use a large pan on high heat"
- **Honest notes** - "Texture will be different but still delicious"
- **No judgment** - Whether you have a rice cooker or full kitchen

### 🌍 Cultural Respect
- **Specific regions** - Szechuan, Shanghainese, Northern Indian (never "Asian")
- **Recipe attribution** - "Inspired by..." not claiming ownership
- **Authentic techniques** - Real cooking methods, not shortcuts
- **Global coverage** - Asian, European, Middle Eastern, Latin American cuisines

### 📊 Personalization
**Priority system (1-5 stars, 6 if exceptional):**
- Flavor
- Nutrition
- Healthiness
- Difficulty

**Weighted recommendations:**
- If Flavor = 5 stars, Healthiness = 2 stars → You get bold, delicious recipes
- If Nutrition = 5, Healthiness = 5 → You get balanced, wholesome meals

### 💾 Data Management
- **LocalStorage** - All data saved in your browser
- **No login required** - Complete privacy
- **Export/Import** - Backup your data anytime
- **Reset option** - Start fresh whenever needed

---

## 🎨 Design System

### Color Palette (Orange Monochrome)
```css
--orange-lightest: #FFE5CC  /* Subtle backgrounds */
--orange-light:    #FFB366  /* Main app background */
--orange-main:     #FF7700  /* Primary actions */
--orange-dark:     #CC5F00  /* Borders, emphasis */
--orange-darkest:  #994700  /* Text, deep contrast */
```

### Design Principles
- **Bold orange signature** - Instantly recognizable
- **2px borders** - Strong definition, not subtle
- **No transparency** - All colors are solid/opaque
- **Pill-shaped buttons** - Fully rounded (border-radius: 9999px)
- **Consistent spacing** - 4px base unit (4, 8, 12, 16, 24, 32, 40, 48)
- **SF Pro font system** - Apple's system font with fallbacks

---

## 📖 Current Recipe Database

**15 Tested Recipes:**

**Asian Cuisines (8):**
1. Mapo Tofu (Szechuan) - 35 min, Intermediate
2. Kung Pao Chicken (Szechuan) - 35 min, Intermediate
3. Thai Green Curry - 40 min, Beginner
4. Pad Thai - 40 min, Intermediate
5. Teriyaki Salmon (Japanese) - 25 min, Beginner
6. Miso Soup (Japanese) - 20 min, Beginner
7. Pho Bo (Vietnamese) - 3.5 hours, Intermediate
8. Dal Tadka (Indian) - 45 min, Beginner

**European Cuisines (5):**
9. Cacio e Pepe (Italian) - 20 min, Intermediate
10. Pasta Pomodoro (Italian) - 35 min, Beginner
11. Risotto alla Milanese (Italian) - 40 min, Intermediate
12. Paella Valenciana (Spanish) - 65 min, Advanced

**Middle Eastern/North African (1):**
13. Shakshuka - 40 min, Beginner

**Latin American (1):**
14. Tacos al Pastor (Mexican) - 45 min + marination, Intermediate

**Indian (1):**
15. Butter Chicken (Northern Indian) - 60 min, Intermediate

---

## 🔄 Adding More Recipes

### Recipe Data Structure

Recipes are stored in `data/recipes.json`. Each recipe follows this structure:

```json
{
  "id": "recipe-001",
  "name": "Recipe Name",
  "cuisine": "Specific Region (e.g., Szechuan)",
  "region": "Geographic details",
  "description": "Brief description",
  "timing": {
    "prep_time": 15,
    "cook_time": 20,
    "total_time": 35
  },
  "servings": {
    "base": 2,
    "scalable": true
  },
  "difficulty": "beginner|intermediate|advanced|expert",
  "scores": {
    "flavor": 5,
    "nutrition": 4,
    "healthiness": 3,
    "difficulty": 3
  },
  "dietary_tags": ["vegetarian", "gluten-free", etc.],
  "allergens": ["soy", "dairy", etc.],
  "equipment_required": ["pan", "knife"],
  "equipment_substitutions": [
    {
      "original": "wok",
      "substitute": "large pan",
      "note": "Use high heat. Texture differs but still delicious."
    }
  ],
  "ingredients": [
    {
      "id": "ing-001",
      "name": "ingredient name",
      "amount": 400,
      "unit": "g",
      "preparation": "diced, minced, etc.",
      "category": "protein|vegetables|spice|etc."
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Short step title",
      "instruction": "Detailed instruction",
      "ingredients_used": ["ing-001"],
      "timer_seconds": 120,
      "tips": "Helpful cooking tip"
    }
  ],
  "nutrition": {
    "calories": 380,
    "protein": 28,
    "carbs": 12,
    "fat": 24,
    "fiber": 3,
    "per_serving": true
  },
  "storage": {
    "fridge": "3-4 days",
    "freezer": "Not recommended",
    "reheating": "Instructions"
  },
  "attribution": {
    "source": "Original recipe by Palate",
    "inspiration": "Traditional cuisine",
    "tested_by": "Palate",
    "date_added": "2025-03-05"
  }
}
```

### Adding Your Tested Recipes

1. Test the recipe yourself
2. Make your modifications
3. Write in your own words
4. Add to `data/recipes.json` following the structure above
5. Refresh the app - new recipes load automatically!

**See `recipe-template.json` for a detailed example.**

---

## 🎯 Roadmap / Future Features

### v2 Features (Planned)
- [ ] **Meal prep mode** - Cook 2-3 recipes Sunday, eat all week
- [ ] **Leftover transformation** - "Turn Monday's chicken into Tuesday's soup"
- [ ] **Cost tracking** - Estimate cost per serving
- [ ] **Macro calculator** - Detailed protein/carbs/fat breakdown
- [ ] **Video tutorials** - Visual guides for techniques
- [ ] **User-submitted recipes** - Community contributions
- [ ] **Voice control** - Hands-free cooking mode
- [ ] **Print-friendly recipe cards** - Beautiful PDF exports
- [ ] **Calendar integration** - Sync with your weekly schedule

### v3 Features (Future)
- [ ] **Multi-language support** - Internationalization
- [ ] **Offline mode** - Download recipes for cooking without internet
- [ ] **Smart speaker integration** - "Alexa, start the timer"
- [ ] **Grocery delivery integration** - One-click shopping
- [ ] **Fitness app sync** - Match macros to workout goals

---

## 🐛 Known Issues / Limitations

### Current Limitations
1. **Browser-only** - Requires modern browser (Chrome, Firefox, Safari, Edge)
2. **LocalStorage** - Data tied to single browser (use export/backup)
3. **No backend** - All processing happens client-side
4. **Recipe loading** - Needs local server due to CORS restrictions
5. **Limited recipes** - Starting with 15, you'll add more as you test them

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

---

## 🤝 Contributing

This is your personal cooking app! Add recipes as you:
1. **Test them** in your kitchen
2. **Make modifications** based on your experience
3. **Write in your own words**
4. **Add to the database**

**Recipe sources to respect:**
- Always attribute inspiration ("Inspired by [Book Name]")
- Rewrite completely in your own words
- Include your own modifications and tips
- Take your own photos

---

## 📄 License & Attribution

**Recipe Attribution:**
- Initial recipes created as original interpretations by Palate
- Inspired by traditional cuisines from around the world
- Always credit specific regional origins (e.g., "Szechuan" not "Chinese")

**Code:**
- Built with vanilla JavaScript (no frameworks)
- CSS custom properties for theming
- LocalStorage API for data persistence

---

## 💡 Tips for Best Experience

### For New Users
1. **Be honest in onboarding** - Your preferences shape everything
2. **Update equipment list** - Add items as you acquire them
3. **Try repeat recipes** - Mastery builds confidence
4. **Adjust adventure level** - Change as you grow

### For Cooking
1. **Read full recipe first** - Understand the flow
2. **Check ingredient boxes** - Mark off as you prep
3. **Use built-in timers** - Don't watch the clock
4. **Take notes** - Save your modifications for next time

### For Meal Planning
1. **Generate Sunday night** - Plan your week ahead
2. **Check pantry first** - Avoid duplicate buying
3. **Swap if needed** - Don't like a recipe? Swap it!
4. **Mark as cooked** - Track your progress

---

## 📞 Support

**Found a bug?** Check the browser console (F12) for error messages.

**Need help?** 
- Check this README
- Review the code comments (heavily documented)
- Inspect recipe-template.json for data structure

**Want to share feedback?**
- Keep notes on what works and doesn't
- Track which recipes you love
- Consider which features would help most

---

## 🎉 Enjoy Cooking!

**Remember:** Palate is designed to make cooking **less stressful**, not more. Start simple, build confidence, and enjoy the journey!

Happy cooking! 🍳👨‍🍳👩‍🍳

---

**Version:** 1.0.0  
**Last Updated:** March 5, 2025  
**Recipe Count:** 15 (and growing!)
