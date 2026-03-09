/* ===================================
   KITCHEN HACKS LIBRARY
   Practical tips & shortcuts for everyday cooking
   =================================== */

const kitchenHacks = {
    hacks: [
        // PREP HACKS
        {
            id: 'prep-001',
            title: 'Peel Garlic in 10 Seconds',
            category: 'Prep Hacks',
            problem: 'Peeling garlic one clove at a time is tedious',
            solution: 'Put whole garlic cloves in a jar with lid. Shake vigorously for 10 seconds. The skins fall right off!',
            difficulty: 'beginner',
            timeSaved: 120
        },
        {
            id: 'prep-002',
            title: 'Dice Onions Without Crying',
            category: 'Prep Hacks',
            problem: 'Cutting onions makes you cry',
            solution: 'Freeze onions for 15 minutes before cutting. The cold reduces the release of tear-causing enzymes.',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'prep-003',
            title: 'Pit Cherries with Chopstick',
            category: 'Prep Hacks',
            problem: 'No cherry pitter available',
            solution: 'Push a chopstick through the stem end of the cherry. The pit pops right out!',
            difficulty: 'beginner',
            timeSaved: 180
        },
        {
            id: 'prep-004',
            title: 'Separate Egg Yolks with Bottle',
            category: 'Prep Hacks',
            problem: 'Separating eggs is messy',
            solution: 'Crack egg onto plate. Squeeze empty water bottle over yolk, release to suck it up. Works perfectly!',
            difficulty: 'beginner',
            timeSaved: 30
        },
        {
            id: 'prep-005',
            title: 'Soften Butter Fast',
            category: 'Prep Hacks',
            problem: 'Forgot to soften butter for baking',
            solution: 'Grate cold butter with box grater. It softens in minutes!',
            difficulty: 'beginner',
            timeSaved: 600
        },
        
        // COOKING HACKS
        {
            id: 'cook-001',
            title: 'Add Pasta Water to Sauce',
            category: 'Cooking Hacks',
            problem: 'Sauce is too thick or won\'t stick to pasta',
            solution: 'Save ½ cup pasta water before draining. The starch makes sauce silky and helps it cling to pasta.',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'cook-002',
            title: 'Salt Water After Boiling',
            category: 'Cooking Hacks',
            problem: 'Waiting for water to boil takes forever',
            solution: 'Boil water FIRST, then add salt. Salt raises boiling point, making it take longer.',
            difficulty: 'beginner',
            timeSaved: 120
        },
        {
            id: 'cook-003',
            title: 'Deglaze Pan for Flavor',
            category: 'Cooking Hacks',
            problem: 'Brown bits stuck to pan go to waste',
            solution: 'After cooking meat, add wine/broth to hot pan. Scrape up brown bits for instant sauce!',
            difficulty: 'intermediate',
            timeSaved: 0
        },
        {
            id: 'cook-004',
            title: 'Rest Meat Before Cutting',
            category: 'Cooking Hacks',
            problem: 'Juices run out when cutting meat',
            solution: 'Let meat rest 5-10 minutes after cooking. Juices redistribute, keeping meat moist.',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'cook-005',
            title: 'Toast Spices Before Using',
            category: 'Cooking Hacks',
            problem: 'Spices taste flat or old',
            solution: 'Toast whole spices in dry pan for 30 seconds. Releases oils and intensifies flavor dramatically!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        
        // STORAGE HACKS
        {
            id: 'store-001',
            title: 'Store Herbs in Water',
            category: 'Storage Hacks',
            problem: 'Fresh herbs wilt quickly',
            solution: 'Trim stems, place in jar with water like flowers. Cover loosely. Lasts 2 weeks!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'store-002',
            title: 'Wrap Banana Stems',
            category: 'Storage Hacks',
            problem: 'Bananas ripen too fast',
            solution: 'Wrap stems in plastic wrap. Slows ethylene gas release, keeping bananas fresh 3-5 days longer.',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'store-003',
            title: 'Freeze Ginger for Grating',
            category: 'Storage Hacks',
            problem: 'Fresh ginger gets moldy quickly',
            solution: 'Store ginger in freezer. Grates easier when frozen and lasts for months!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'store-004',
            title: 'Revive Stale Bread',
            category: 'Storage Hacks',
            problem: 'Bread went stale',
            solution: 'Sprinkle bread with water, wrap in foil, bake at 300°F for 10 min. Like fresh again!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'store-005',
            title: 'Freeze Wine in Ice Cubes',
            category: 'Storage Hacks',
            problem: 'Leftover wine goes bad',
            solution: 'Pour into ice cube tray and freeze. Perfect portions for cooking!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        
        // EQUIPMENT HACKS
        {
            id: 'equip-001',
            title: 'Wine Bottle = Rolling Pin',
            category: 'Equipment Hacks',
            problem: 'No rolling pin',
            solution: 'Use a wine bottle (full or empty). Works perfectly for rolling dough!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'equip-002',
            title: 'Fork + Salt = Garlic Press',
            category: 'Equipment Hacks',
            problem: 'No garlic press',
            solution: 'Mince garlic, add pinch of salt, mash with fork. Makes a perfect paste!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'equip-003',
            title: 'Box Grater = Zester',
            category: 'Equipment Hacks',
            problem: 'No zester or microplane',
            solution: 'Use the smallest holes on box grater. Works great for citrus zest!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'equip-004',
            title: 'Wooden Spoon Bubble Test',
            category: 'Equipment Hacks',
            problem: 'No thermometer for frying oil',
            solution: 'Put wooden spoon handle in oil. If bubbles form around it, oil is ready (350°F)!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        
        // FLAVOR HACKS
        {
            id: 'flavor-001',
            title: 'Too Salty? Add Potato',
            category: 'Flavor Hacks',
            problem: 'Soup or stew is too salty',
            solution: 'Add raw potato chunks, simmer 20 min, remove. Potato absorbs excess salt!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'flavor-002',
            title: 'Too Spicy? Add Dairy',
            category: 'Flavor Hacks',
            problem: 'Dish is too spicy',
            solution: 'Stir in yogurt, cream, or coconut milk. Fat molecules neutralize capsaicin (heat compound).',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'flavor-003',
            title: 'Bland Soup? Add Acid',
            category: 'Flavor Hacks',
            problem: 'Soup tastes flat or boring',
            solution: 'Add splash of lemon juice or vinegar. Acid brightens all flavors instantly!',
            difficulty: 'beginner',
            timeSaved: 0
        },
        {
            id: 'flavor-004',
            title: 'Burnt Garlic? Toast Breadcrumbs',
            category: 'Flavor Hacks',
            problem: 'Accidentally burnt garlic',
            solution: 'Toast breadcrumbs in separate pan. The toasted smell masks burnt garlic odor!',
            difficulty: 'intermediate',
            timeSaved: 0
        },
        {
            id: 'flavor-005',
            title: 'Add MSG for Umami',
            category: 'Flavor Hacks',
            problem: 'Dish lacks depth/savoriness',
            solution: 'Add tiny pinch of MSG (or soy sauce, fish sauce, parmesan). Instant umami boost!',
            difficulty: 'beginner',
            timeSaved: 0
        }
        
        // Add more hacks as needed...
    ],
    
    // Get hacks by category
    getByCategory: function(category) {
        return this.hacks.filter(hack => hack.category === category);
    },
    
    // Search hacks
    search: function(query) {
        const q = query.toLowerCase();
        return this.hacks.filter(hack => 
            hack.title.toLowerCase().includes(q) ||
            hack.problem.toLowerCase().includes(q) ||
            hack.solution.toLowerCase().includes(q)
        );
    },
    
    // Get all categories
    getCategories: function() {
        return [...new Set(this.hacks.map(hack => hack.category))];
    }
};
