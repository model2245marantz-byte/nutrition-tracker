// ============================================================
// Nutrition Database & Natural Language Food Parser
// ============================================================
// Each entry: { calories, protein, carbs, fat, fiber, sodium }
// Values are per standard serving.

const NUTRITION_DB = {
  // === Proteins ===
  "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, serving: "6 oz" },
  "grilled chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, serving: "6 oz" },
  "chicken thigh": { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sodium: 84, serving: "6 oz" },
  "grilled chicken thigh": { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sodium: 84, serving: "6 oz" },
  "chicken wing": { calories: 100, protein: 9, carbs: 0, fat: 7, fiber: 0, sodium: 85, serving: "1 wing" },
  "chicken tender": { calories: 130, protein: 14, carbs: 8, fat: 5, fiber: 0, sodium: 300, serving: "2 pieces" },
  "chicken tenders": { calories: 260, protein: 28, carbs: 16, fat: 10, fiber: 0, sodium: 600, serving: "4 pieces" },
  "rotisserie chicken": { calories: 220, protein: 30, carbs: 0, fat: 11, fiber: 0, sodium: 350, serving: "6 oz" },
  "turkey breast": { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sodium: 55, serving: "6 oz" },
  "ground turkey": { calories: 200, protein: 27, carbs: 0, fat: 10, fiber: 0, sodium: 90, serving: "6 oz" },
  "ground beef": { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sodium: 75, serving: "6 oz" },
  "lean ground beef": { calories: 200, protein: 28, carbs: 0, fat: 10, fiber: 0, sodium: 75, serving: "6 oz" },
  "steak": { calories: 270, protein: 34, carbs: 0, fat: 14, fiber: 0, sodium: 60, serving: "6 oz" },
  "sirloin steak": { calories: 240, protein: 34, carbs: 0, fat: 10, fiber: 0, sodium: 60, serving: "6 oz" },
  "ribeye steak": { calories: 310, protein: 30, carbs: 0, fat: 20, fiber: 0, sodium: 60, serving: "6 oz" },
  "filet mignon": { calories: 260, protein: 34, carbs: 0, fat: 13, fiber: 0, sodium: 55, serving: "6 oz" },
  "pork chop": { calories: 230, protein: 30, carbs: 0, fat: 12, fiber: 0, sodium: 60, serving: "6 oz" },
  "pork tenderloin": { calories: 185, protein: 30, carbs: 0, fat: 6, fiber: 0, sodium: 55, serving: "6 oz" },
  "bacon": { calories: 120, protein: 9, carbs: 0, fat: 9, fiber: 0, sodium: 480, serving: "3 slices" },
  "turkey bacon": { calories: 90, protein: 10, carbs: 0, fat: 5, fiber: 0, sodium: 430, serving: "3 slices" },
  "sausage": { calories: 200, protein: 12, carbs: 2, fat: 16, fiber: 0, sodium: 550, serving: "2 links" },
  "sausage link": { calories: 100, protein: 6, carbs: 1, fat: 8, fiber: 0, sodium: 275, serving: "1 link" },
  "salmon": { calories: 280, protein: 34, carbs: 0, fat: 15, fiber: 0, sodium: 60, serving: "6 oz" },
  "grilled salmon": { calories: 280, protein: 34, carbs: 0, fat: 15, fiber: 0, sodium: 60, serving: "6 oz" },
  "tuna": { calories: 130, protein: 28, carbs: 0, fat: 1, fiber: 0, sodium: 45, serving: "5 oz can" },
  "canned tuna": { calories: 130, protein: 28, carbs: 0, fat: 1, fiber: 0, sodium: 300, serving: "5 oz can" },
  "shrimp": { calories: 120, protein: 24, carbs: 0, fat: 1.5, fiber: 0, sodium: 240, serving: "6 oz" },
  "tilapia": { calories: 145, protein: 30, carbs: 0, fat: 3, fiber: 0, sodium: 55, serving: "6 oz" },
  "cod": { calories: 140, protein: 30, carbs: 0, fat: 1, fiber: 0, sodium: 90, serving: "6 oz" },
  "tofu": { calories: 144, protein: 15, carbs: 3.5, fat: 8, fiber: 1, sodium: 14, serving: "7 oz" },
  "tempeh": { calories: 195, protein: 20, carbs: 8, fat: 11, fiber: 5, sodium: 15, serving: "5 oz" },

  // === Eggs & Dairy ===
  "egg": { calories: 72, protein: 6, carbs: 0.4, fat: 5, fiber: 0, sodium: 71, serving: "1 large" },
  "eggs": { calories: 144, protein: 12, carbs: 0.8, fat: 10, fiber: 0, sodium: 142, serving: "2 large" },
  "scrambled eggs": { calories: 182, protein: 12, carbs: 2, fat: 14, fiber: 0, sodium: 170, serving: "2 eggs" },
  "fried egg": { calories: 90, protein: 6, carbs: 0.4, fat: 7, fiber: 0, sodium: 95, serving: "1 egg" },
  "egg white": { calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, sodium: 55, serving: "1 large" },
  "hard boiled egg": { calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sodium: 62, serving: "1 large" },
  "greek yogurt": { calories: 130, protein: 17, carbs: 8, fat: 4, fiber: 0, sodium: 60, serving: "1 cup" },
  "yogurt": { calories: 140, protein: 8, carbs: 20, fat: 3, fiber: 0, sodium: 95, serving: "1 cup" },
  "cottage cheese": { calories: 183, protein: 24, carbs: 8, fat: 5, fiber: 0, sodium: 700, serving: "1 cup" },
  "cheese": { calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sodium: 174, serving: "1 oz" },
  "cheddar cheese": { calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sodium: 174, serving: "1 oz" },
  "mozzarella": { calories: 85, protein: 6, carbs: 0.7, fat: 6, fiber: 0, sodium: 138, serving: "1 oz" },
  "parmesan": { calories: 110, protein: 10, carbs: 1, fat: 7, fiber: 0, sodium: 390, serving: "1 oz" },
  "cream cheese": { calories: 100, protein: 2, carbs: 1, fat: 10, fiber: 0, sodium: 90, serving: "1 oz" },
  "milk": { calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, sodium: 105, serving: "1 cup" },
  "whole milk": { calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, sodium: 105, serving: "1 cup" },
  "skim milk": { calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0, sodium: 105, serving: "1 cup" },
  "almond milk": { calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 0, sodium: 150, serving: "1 cup" },
  "oat milk": { calories: 120, protein: 3, carbs: 16, fat: 5, fiber: 2, sodium: 100, serving: "1 cup" },
  "whey protein": { calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, sodium: 130, serving: "1 scoop" },
  "protein shake": { calories: 160, protein: 30, carbs: 5, fat: 2, fiber: 1, sodium: 200, serving: "1 shake" },
  "protein bar": { calories: 210, protein: 20, carbs: 22, fat: 8, fiber: 3, sodium: 180, serving: "1 bar" },
  "butter": { calories: 102, protein: 0, carbs: 0, fat: 12, fiber: 0, sodium: 2, serving: "1 tbsp" },

  // === Grains & Carbs ===
  "rice": { calories: 215, protein: 4.5, carbs: 45, fat: 0.4, fiber: 0.6, sodium: 2, serving: "1 cup cooked" },
  "white rice": { calories: 215, protein: 4.5, carbs: 45, fat: 0.4, fiber: 0.6, sodium: 2, serving: "1 cup cooked" },
  "brown rice": { calories: 215, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sodium: 10, serving: "1 cup cooked" },
  "quinoa": { calories: 222, protein: 8, carbs: 39, fat: 4, fiber: 5, sodium: 13, serving: "1 cup cooked" },
  "oatmeal": { calories: 154, protein: 5, carbs: 27, fat: 2.5, fiber: 4, sodium: 2, serving: "1 cup cooked" },
  "oats": { calories: 154, protein: 5, carbs: 27, fat: 2.5, fiber: 4, sodium: 2, serving: "1 cup cooked" },
  "pasta": { calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sodium: 1, serving: "1 cup cooked" },
  "spaghetti": { calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sodium: 1, serving: "1 cup cooked" },
  "whole wheat pasta": { calories: 174, protein: 7.5, carbs: 37, fat: 0.8, fiber: 6, sodium: 4, serving: "1 cup cooked" },
  "bread": { calories: 75, protein: 3, carbs: 14, fat: 1, fiber: 0.7, sodium: 130, serving: "1 slice" },
  "white bread": { calories: 75, protein: 3, carbs: 14, fat: 1, fiber: 0.7, sodium: 130, serving: "1 slice" },
  "whole wheat bread": { calories: 80, protein: 4, carbs: 14, fat: 1, fiber: 2, sodium: 130, serving: "1 slice" },
  "sourdough bread": { calories: 90, protein: 4, carbs: 18, fat: 0.5, fiber: 1, sodium: 180, serving: "1 slice" },
  "bagel": { calories: 270, protein: 10, carbs: 53, fat: 1.5, fiber: 2, sodium: 430, serving: "1 bagel" },
  "english muffin": { calories: 130, protein: 5, carbs: 25, fat: 1, fiber: 2, sodium: 200, serving: "1 muffin" },
  "tortilla": { calories: 140, protein: 4, carbs: 24, fat: 3.5, fiber: 1, sodium: 350, serving: "1 large" },
  "flour tortilla": { calories: 140, protein: 4, carbs: 24, fat: 3.5, fiber: 1, sodium: 350, serving: "1 large" },
  "corn tortilla": { calories: 60, protein: 1.5, carbs: 12, fat: 0.7, fiber: 1.5, sodium: 11, serving: "1 tortilla" },
  "wrap": { calories: 140, protein: 4, carbs: 24, fat: 3.5, fiber: 1, sodium: 350, serving: "1 wrap" },
  "pita bread": { calories: 165, protein: 5.5, carbs: 33, fat: 0.7, fiber: 1, sodium: 320, serving: "1 large" },
  "naan": { calories: 260, protein: 9, carbs: 45, fat: 5, fiber: 2, sodium: 490, serving: "1 piece" },
  "pancake": { calories: 175, protein: 5, carbs: 22, fat: 7, fiber: 1, sodium: 420, serving: "2 medium" },
  "pancakes": { calories: 175, protein: 5, carbs: 22, fat: 7, fiber: 1, sodium: 420, serving: "2 medium" },
  "waffle": { calories: 218, protein: 6, carbs: 25, fat: 11, fiber: 1, sodium: 380, serving: "1 waffle" },
  "french toast": { calories: 280, protein: 10, carbs: 36, fat: 11, fiber: 1, sodium: 400, serving: "2 slices" },
  "cereal": { calories: 150, protein: 3, carbs: 33, fat: 1, fiber: 3, sodium: 200, serving: "1 cup" },
  "granola": { calories: 210, protein: 5, carbs: 28, fat: 9, fiber: 3, sodium: 10, serving: "0.5 cup" },
  "crackers": { calories: 140, protein: 2, carbs: 20, fat: 6, fiber: 1, sodium: 250, serving: "6 crackers" },
  "potato": { calories: 165, protein: 4, carbs: 37, fat: 0.2, fiber: 4, sodium: 10, serving: "1 medium" },
  "baked potato": { calories: 165, protein: 4, carbs: 37, fat: 0.2, fiber: 4, sodium: 10, serving: "1 medium" },
  "sweet potato": { calories: 115, protein: 2, carbs: 27, fat: 0.1, fiber: 4, sodium: 40, serving: "1 medium" },
  "mashed potatoes": { calories: 210, protein: 4, carbs: 30, fat: 8, fiber: 2, sodium: 350, serving: "1 cup" },
  "french fries": { calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sodium: 250, serving: "medium" },
  "fries": { calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sodium: 250, serving: "medium" },
  "tater tots": { calories: 230, protein: 3, carbs: 30, fat: 11, fiber: 2, sodium: 460, serving: "10 pieces" },
  "hash browns": { calories: 180, protein: 2, carbs: 20, fat: 10, fiber: 2, sodium: 340, serving: "1 patty" },

  // === Vegetables ===
  "broccoli": { calories: 55, protein: 4, carbs: 11, fat: 0.5, fiber: 5, sodium: 50, serving: "1 cup" },
  "spinach": { calories: 7, protein: 1, carbs: 1, fat: 0.1, fiber: 0.7, sodium: 24, serving: "1 cup raw" },
  "kale": { calories: 33, protein: 2.5, carbs: 6, fat: 0.5, fiber: 1.3, sodium: 25, serving: "1 cup" },
  "green beans": { calories: 35, protein: 2, carbs: 8, fat: 0.1, fiber: 4, sodium: 6, serving: "1 cup" },
  "asparagus": { calories: 27, protein: 3, carbs: 5, fat: 0.2, fiber: 2.8, sodium: 3, serving: "6 spears" },
  "bell pepper": { calories: 30, protein: 1, carbs: 7, fat: 0.3, fiber: 2, sodium: 4, serving: "1 medium" },
  "tomato": { calories: 22, protein: 1, carbs: 5, fat: 0.2, fiber: 1.5, sodium: 6, serving: "1 medium" },
  "cucumber": { calories: 16, protein: 0.7, carbs: 4, fat: 0.1, fiber: 0.5, sodium: 2, serving: "1 cup" },
  "carrot": { calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sodium: 42, serving: "1 medium" },
  "carrots": { calories: 50, protein: 1.2, carbs: 12, fat: 0.2, fiber: 3.4, sodium: 84, serving: "2 medium" },
  "onion": { calories: 44, protein: 1, carbs: 10, fat: 0.1, fiber: 1.4, sodium: 4, serving: "1 medium" },
  "corn": { calories: 125, protein: 5, carbs: 27, fat: 2, fiber: 3, sodium: 15, serving: "1 cup" },
  "peas": { calories: 117, protein: 8, carbs: 21, fat: 0.6, fiber: 8, sodium: 5, serving: "1 cup" },
  "mushrooms": { calories: 15, protein: 2, carbs: 2, fat: 0.2, fiber: 0.7, sodium: 4, serving: "1 cup" },
  "zucchini": { calories: 20, protein: 1.5, carbs: 3.5, fat: 0.4, fiber: 1, sodium: 12, serving: "1 cup" },
  "cauliflower": { calories: 27, protein: 2, carbs: 5, fat: 0.3, fiber: 2, sodium: 32, serving: "1 cup" },
  "lettuce": { calories: 5, protein: 0.5, carbs: 1, fat: 0.1, fiber: 0.5, sodium: 5, serving: "1 cup" },
  "mixed greens": { calories: 10, protein: 1, carbs: 2, fat: 0.1, fiber: 1, sodium: 10, serving: "1 cup" },
  "salad": { calories: 20, protein: 1.5, carbs: 4, fat: 0.2, fiber: 2, sodium: 20, serving: "2 cups" },
  "coleslaw": { calories: 150, protein: 1, carbs: 13, fat: 11, fiber: 2, sodium: 260, serving: "1 cup" },
  "edamame": { calories: 188, protein: 18, carbs: 14, fat: 8, fiber: 8, sodium: 9, serving: "1 cup" },
  "avocado": { calories: 240, protein: 3, carbs: 13, fat: 22, fiber: 10, sodium: 11, serving: "1 whole" },

  // === Fruits ===
  "banana": { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, sodium: 1, serving: "1 medium" },
  "apple": { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, sodium: 2, serving: "1 medium" },
  "orange": { calories: 65, protein: 1, carbs: 16, fat: 0.2, fiber: 3, sodium: 1, serving: "1 medium" },
  "strawberries": { calories: 50, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sodium: 2, serving: "1 cup" },
  "blueberries": { calories: 85, protein: 1, carbs: 21, fat: 0.5, fiber: 4, sodium: 1, serving: "1 cup" },
  "grapes": { calories: 62, protein: 0.6, carbs: 16, fat: 0.3, fiber: 0.8, sodium: 2, serving: "1 cup" },
  "watermelon": { calories: 46, protein: 1, carbs: 12, fat: 0.2, fiber: 0.6, sodium: 2, serving: "1 cup" },
  "mango": { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sodium: 2, serving: "1 cup" },
  "pineapple": { calories: 82, protein: 1, carbs: 22, fat: 0.2, fiber: 2, sodium: 2, serving: "1 cup" },
  "mixed berries": { calories: 70, protein: 1, carbs: 17, fat: 0.5, fiber: 4, sodium: 2, serving: "1 cup" },
  "dried fruit": { calories: 130, protein: 1, carbs: 31, fat: 0.5, fiber: 3, sodium: 5, serving: "0.25 cup" },
  "raisins": { calories: 130, protein: 1, carbs: 34, fat: 0.2, fiber: 2, sodium: 5, serving: "0.25 cup" },

  // === Nuts, Seeds & Fats ===
  "almonds": { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sodium: 0, serving: "1 oz (23 nuts)" },
  "peanuts": { calories: 161, protein: 7, carbs: 5, fat: 14, fiber: 2, sodium: 5, serving: "1 oz" },
  "walnuts": { calories: 185, protein: 4, carbs: 4, fat: 18, fiber: 2, sodium: 1, serving: "1 oz" },
  "cashews": { calories: 157, protein: 5, carbs: 9, fat: 12, fiber: 1, sodium: 3, serving: "1 oz" },
  "mixed nuts": { calories: 172, protein: 5, carbs: 7, fat: 15, fiber: 2, sodium: 3, serving: "1 oz" },
  "peanut butter": { calories: 190, protein: 7, carbs: 7, fat: 16, fiber: 2, sodium: 140, serving: "2 tbsp" },
  "almond butter": { calories: 196, protein: 7, carbs: 6, fat: 18, fiber: 3, sodium: 2, serving: "2 tbsp" },
  "olive oil": { calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sodium: 0, serving: "1 tbsp" },
  "coconut oil": { calories: 121, protein: 0, carbs: 0, fat: 14, fiber: 0, sodium: 0, serving: "1 tbsp" },
  "cooking oil": { calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sodium: 0, serving: "1 tbsp" },
  "chia seeds": { calories: 137, protein: 4, carbs: 12, fat: 9, fiber: 10, sodium: 5, serving: "1 oz" },
  "flax seeds": { calories: 150, protein: 5, carbs: 8, fat: 12, fiber: 8, sodium: 9, serving: "1 oz" },
  "sunflower seeds": { calories: 165, protein: 6, carbs: 7, fat: 14, fiber: 3, sodium: 1, serving: "1 oz" },
  "hummus": { calories: 70, protein: 2, carbs: 6, fat: 5, fiber: 1, sodium: 150, serving: "2 tbsp" },
  "guacamole": { calories: 100, protein: 1, carbs: 6, fat: 9, fiber: 4, sodium: 200, serving: "0.25 cup" },

  // === Sauces & Condiments ===
  "ketchup": { calories: 20, protein: 0, carbs: 5, fat: 0, fiber: 0, sodium: 160, serving: "1 tbsp" },
  "mustard": { calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, fiber: 0, sodium: 55, serving: "1 tsp" },
  "mayo": { calories: 100, protein: 0, carbs: 0, fat: 11, fiber: 0, sodium: 80, serving: "1 tbsp" },
  "mayonnaise": { calories: 100, protein: 0, carbs: 0, fat: 11, fiber: 0, sodium: 80, serving: "1 tbsp" },
  "soy sauce": { calories: 10, protein: 1, carbs: 1, fat: 0, fiber: 0, sodium: 920, serving: "1 tbsp" },
  "hot sauce": { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 200, serving: "1 tsp" },
  "bbq sauce": { calories: 30, protein: 0, carbs: 7, fat: 0, fiber: 0, sodium: 280, serving: "1 tbsp" },
  "ranch dressing": { calories: 130, protein: 0, carbs: 2, fat: 14, fiber: 0, sodium: 260, serving: "2 tbsp" },
  "italian dressing": { calories: 70, protein: 0, carbs: 3, fat: 7, fiber: 0, sodium: 310, serving: "2 tbsp" },
  "balsamic vinaigrette": { calories: 80, protein: 0, carbs: 4, fat: 7, fiber: 0, sodium: 270, serving: "2 tbsp" },
  "salsa": { calories: 15, protein: 0.5, carbs: 3, fat: 0.1, fiber: 0.5, sodium: 200, serving: "2 tbsp" },
  "sour cream": { calories: 60, protein: 1, carbs: 1, fat: 5, fiber: 0, sodium: 15, serving: "2 tbsp" },
  "maple syrup": { calories: 52, protein: 0, carbs: 13, fat: 0, fiber: 0, sodium: 2, serving: "1 tbsp" },
  "honey": { calories: 64, protein: 0, carbs: 17, fat: 0, fiber: 0, sodium: 1, serving: "1 tbsp" },
  "jam": { calories: 50, protein: 0, carbs: 13, fat: 0, fiber: 0, sodium: 6, serving: "1 tbsp" },
  "marinara sauce": { calories: 70, protein: 2, carbs: 10, fat: 2, fiber: 2, sodium: 500, serving: "0.5 cup" },
  "tomato sauce": { calories: 70, protein: 2, carbs: 10, fat: 2, fiber: 2, sodium: 500, serving: "0.5 cup" },
  "pesto": { calories: 80, protein: 2, carbs: 1, fat: 8, fiber: 0.5, sodium: 180, serving: "1 tbsp" },
  "teriyaki sauce": { calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 0, sodium: 610, serving: "1 tbsp" },

  // === Beverages ===
  "coffee": { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 5, serving: "1 cup" },
  "black coffee": { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 5, serving: "1 cup" },
  "latte": { calories: 190, protein: 10, carbs: 18, fat: 7, fiber: 0, sodium: 130, serving: "16 oz" },
  "cappuccino": { calories: 120, protein: 8, carbs: 12, fat: 4, fiber: 0, sodium: 100, serving: "12 oz" },
  "iced coffee": { calories: 80, protein: 1, carbs: 12, fat: 3, fiber: 0, sodium: 20, serving: "16 oz" },
  "tea": { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, serving: "1 cup" },
  "green tea": { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, serving: "1 cup" },
  "orange juice": { calories: 112, protein: 2, carbs: 26, fat: 0.5, fiber: 0.5, sodium: 2, serving: "1 cup" },
  "apple juice": { calories: 114, protein: 0.3, carbs: 28, fat: 0.3, fiber: 0.5, sodium: 10, serving: "1 cup" },
  "smoothie": { calories: 250, protein: 5, carbs: 45, fat: 5, fiber: 4, sodium: 50, serving: "16 oz" },
  "protein smoothie": { calories: 300, protein: 30, carbs: 35, fat: 6, fiber: 5, sodium: 150, serving: "16 oz" },
  "soda": { calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sodium: 45, serving: "12 oz" },
  "diet soda": { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 40, serving: "12 oz" },
  "beer": { calories: 153, protein: 2, carbs: 13, fat: 0, fiber: 0, sodium: 14, serving: "12 oz" },
  "light beer": { calories: 103, protein: 1, carbs: 6, fat: 0, fiber: 0, sodium: 14, serving: "12 oz" },
  "wine": { calories: 125, protein: 0, carbs: 4, fat: 0, fiber: 0, sodium: 6, serving: "5 oz" },
  "water": { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, serving: "1 cup" },
  "sparkling water": { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, serving: "1 cup" },
  "sports drink": { calories: 80, protein: 0, carbs: 21, fat: 0, fiber: 0, sodium: 160, serving: "12 oz" },
  "energy drink": { calories: 110, protein: 0, carbs: 28, fat: 0, fiber: 0, sodium: 200, serving: "8 oz" },

  // === Common Meals ===
  "chipotle burrito bowl": { calories: 665, protein: 36, carbs: 75, fat: 22, fiber: 12, sodium: 1420, serving: "1 bowl" },
  "chipotle burrito": { calories: 945, protein: 45, carbs: 105, fat: 36, fiber: 14, sodium: 2150, serving: "1 burrito" },
  "burrito bowl": { calories: 600, protein: 32, carbs: 70, fat: 20, fiber: 10, sodium: 1200, serving: "1 bowl" },
  "burrito": { calories: 800, protein: 35, carbs: 85, fat: 30, fiber: 8, sodium: 1500, serving: "1 burrito" },
  "taco": { calories: 210, protein: 9, carbs: 20, fat: 10, fiber: 2, sodium: 380, serving: "1 taco" },
  "tacos": { calories: 420, protein: 18, carbs: 40, fat: 20, fiber: 4, sodium: 760, serving: "2 tacos" },
  "quesadilla": { calories: 470, protein: 22, carbs: 38, fat: 25, fiber: 2, sodium: 900, serving: "1 quesadilla" },
  "nachos": { calories: 550, protein: 16, carbs: 52, fat: 32, fiber: 5, sodium: 1200, serving: "1 plate" },
  "pizza slice": { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sodium: 640, serving: "1 large slice" },
  "pizza": { calories: 570, protein: 24, carbs: 72, fat: 20, fiber: 4, sodium: 1280, serving: "2 slices" },
  "pepperoni pizza": { calories: 310, protein: 13, carbs: 36, fat: 13, fiber: 2, sodium: 760, serving: "1 slice" },
  "hamburger": { calories: 540, protein: 34, carbs: 40, fat: 27, fiber: 2, sodium: 780, serving: "1 burger" },
  "cheeseburger": { calories: 610, protein: 37, carbs: 42, fat: 33, fiber: 2, sodium: 1050, serving: "1 burger" },
  "veggie burger": { calories: 390, protein: 22, carbs: 44, fat: 14, fiber: 6, sodium: 700, serving: "1 burger" },
  "hot dog": { calories: 310, protein: 11, carbs: 24, fat: 18, fiber: 1, sodium: 810, serving: "1 hot dog" },
  "grilled cheese": { calories: 440, protein: 16, carbs: 36, fat: 26, fiber: 2, sodium: 800, serving: "1 sandwich" },
  "blt": { calories: 400, protein: 16, carbs: 30, fat: 24, fiber: 2, sodium: 900, serving: "1 sandwich" },
  "club sandwich": { calories: 550, protein: 30, carbs: 40, fat: 28, fiber: 3, sodium: 1200, serving: "1 sandwich" },
  "turkey sandwich": { calories: 350, protein: 24, carbs: 35, fat: 12, fiber: 3, sodium: 850, serving: "1 sandwich" },
  "chicken sandwich": { calories: 450, protein: 28, carbs: 40, fat: 18, fiber: 2, sodium: 900, serving: "1 sandwich" },
  "sub sandwich": { calories: 500, protein: 24, carbs: 50, fat: 20, fiber: 3, sodium: 1300, serving: "6 inch" },
  "wrap": { calories: 400, protein: 20, carbs: 40, fat: 18, fiber: 3, sodium: 850, serving: "1 wrap" },
  "chicken wrap": { calories: 420, protein: 28, carbs: 38, fat: 16, fiber: 3, sodium: 880, serving: "1 wrap" },
  "caesar salad": { calories: 360, protein: 10, carbs: 15, fat: 28, fiber: 3, sodium: 750, serving: "1 bowl" },
  "chicken caesar salad": { calories: 470, protein: 35, carbs: 15, fat: 30, fiber: 3, sodium: 900, serving: "1 bowl" },
  "cobb salad": { calories: 500, protein: 30, carbs: 12, fat: 38, fiber: 5, sodium: 1050, serving: "1 bowl" },
  "garden salad": { calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 4, sodium: 45, serving: "1 bowl" },
  "soup": { calories: 150, protein: 6, carbs: 18, fat: 5, fiber: 2, sodium: 800, serving: "1 bowl" },
  "chicken soup": { calories: 170, protein: 12, carbs: 18, fat: 5, fiber: 1, sodium: 900, serving: "1 bowl" },
  "tomato soup": { calories: 130, protein: 4, carbs: 20, fat: 4, fiber: 3, sodium: 700, serving: "1 bowl" },
  "chili": { calories: 290, protein: 20, carbs: 28, fat: 10, fiber: 8, sodium: 900, serving: "1 bowl" },
  "mac and cheese": { calories: 380, protein: 14, carbs: 44, fat: 17, fiber: 2, sodium: 750, serving: "1 cup" },
  "fried rice": { calories: 340, protein: 10, carbs: 50, fat: 12, fiber: 2, sodium: 850, serving: "1 cup" },
  "stir fry": { calories: 350, protein: 25, carbs: 30, fat: 14, fiber: 4, sodium: 800, serving: "1 plate" },
  "chicken stir fry": { calories: 380, protein: 30, carbs: 30, fat: 14, fiber: 4, sodium: 850, serving: "1 plate" },
  "pad thai": { calories: 450, protein: 18, carbs: 55, fat: 16, fiber: 3, sodium: 1100, serving: "1 plate" },
  "sushi roll": { calories: 250, protein: 9, carbs: 38, fat: 7, fiber: 2, sodium: 500, serving: "6 pieces" },
  "sushi": { calories: 250, protein: 9, carbs: 38, fat: 7, fiber: 2, sodium: 500, serving: "6 pieces" },
  "ramen": { calories: 450, protein: 18, carbs: 55, fat: 16, fiber: 2, sodium: 1800, serving: "1 bowl" },
  "pho": { calories: 380, protein: 22, carbs: 45, fat: 10, fiber: 1, sodium: 1200, serving: "1 bowl" },
  "curry": { calories: 350, protein: 18, carbs: 25, fat: 20, fiber: 4, sodium: 800, serving: "1 cup" },
  "chicken curry": { calories: 380, protein: 25, carbs: 25, fat: 20, fiber: 4, sodium: 850, serving: "1 cup" },
  "butter chicken": { calories: 420, protein: 28, carbs: 18, fat: 28, fiber: 3, sodium: 900, serving: "1 cup" },
  "tikka masala": { calories: 400, protein: 26, carbs: 20, fat: 24, fiber: 3, sodium: 850, serving: "1 cup" },
  "dal": { calories: 190, protein: 12, carbs: 28, fat: 3, fiber: 8, sodium: 400, serving: "1 cup" },
  "lentil soup": { calories: 230, protein: 14, carbs: 34, fat: 3, fiber: 10, sodium: 600, serving: "1 bowl" },
  "meatballs": { calories: 250, protein: 18, carbs: 8, fat: 16, fiber: 1, sodium: 500, serving: "4 meatballs" },
  "lasagna": { calories: 380, protein: 22, carbs: 38, fat: 16, fiber: 3, sodium: 750, serving: "1 piece" },
  "spaghetti bolognese": { calories: 500, protein: 28, carbs: 55, fat: 18, fiber: 4, sodium: 800, serving: "1 plate" },
  "chicken parmesan": { calories: 550, protein: 40, carbs: 35, fat: 25, fiber: 3, sodium: 1000, serving: "1 serving" },
  "fish and chips": { calories: 600, protein: 25, carbs: 60, fat: 28, fiber: 4, sodium: 900, serving: "1 serving" },
  "fried chicken": { calories: 400, protein: 28, carbs: 16, fat: 24, fiber: 1, sodium: 800, serving: "2 pieces" },
  "chicken nuggets": { calories: 280, protein: 14, carbs: 18, fat: 16, fiber: 1, sodium: 560, serving: "6 pieces" },
  "wings": { calories: 430, protein: 32, carbs: 6, fat: 30, fiber: 0, sodium: 850, serving: "6 wings" },
  "buffalo wings": { calories: 430, protein: 32, carbs: 6, fat: 30, fiber: 0, sodium: 1200, serving: "6 wings" },
  "meatloaf": { calories: 290, protein: 20, carbs: 12, fat: 18, fiber: 1, sodium: 600, serving: "1 slice" },
  "pot roast": { calories: 350, protein: 32, carbs: 15, fat: 18, fiber: 2, sodium: 500, serving: "6 oz" },
  "pulled pork": { calories: 300, protein: 25, carbs: 10, fat: 18, fiber: 0, sodium: 700, serving: "6 oz" },
  "bbq ribs": { calories: 400, protein: 28, carbs: 12, fat: 28, fiber: 0, sodium: 750, serving: "4 ribs" },
  "gyro": { calories: 500, protein: 22, carbs: 40, fat: 28, fiber: 3, sodium: 950, serving: "1 gyro" },
  "falafel": { calories: 330, protein: 13, carbs: 32, fat: 18, fiber: 5, sodium: 580, serving: "4 pieces" },
  "shawarma": { calories: 500, protein: 30, carbs: 40, fat: 24, fiber: 3, sodium: 1000, serving: "1 wrap" },
  "bibimbap": { calories: 500, protein: 25, carbs: 65, fat: 14, fiber: 5, sodium: 900, serving: "1 bowl" },
  "poke bowl": { calories: 450, protein: 28, carbs: 50, fat: 14, fiber: 4, sodium: 800, serving: "1 bowl" },
  "acai bowl": { calories: 380, protein: 6, carbs: 60, fat: 12, fiber: 8, sodium: 25, serving: "1 bowl" },
  "overnight oats": { calories: 350, protein: 12, carbs: 50, fat: 10, fiber: 7, sodium: 100, serving: "1 bowl" },
  "parfait": { calories: 300, protein: 12, carbs: 42, fat: 8, fiber: 3, sodium: 80, serving: "1 parfait" },
  "avocado toast": { calories: 300, protein: 8, carbs: 28, fat: 18, fiber: 8, sodium: 350, serving: "1 slice" },

  // === Snacks & Desserts ===
  "chips": { calories: 160, protein: 2, carbs: 15, fat: 10, fiber: 1, sodium: 170, serving: "1 oz" },
  "potato chips": { calories: 160, protein: 2, carbs: 15, fat: 10, fiber: 1, sodium: 170, serving: "1 oz" },
  "tortilla chips": { calories: 140, protein: 2, carbs: 19, fat: 7, fiber: 1, sodium: 120, serving: "1 oz" },
  "pretzels": { calories: 110, protein: 3, carbs: 23, fat: 1, fiber: 1, sodium: 450, serving: "1 oz" },
  "popcorn": { calories: 110, protein: 3, carbs: 19, fat: 3, fiber: 4, sodium: 80, serving: "3 cups" },
  "trail mix": { calories: 175, protein: 5, carbs: 15, fat: 11, fiber: 2, sodium: 45, serving: "1 oz" },
  "energy bar": { calories: 230, protein: 10, carbs: 30, fat: 8, fiber: 3, sodium: 150, serving: "1 bar" },
  "granola bar": { calories: 190, protein: 3, carbs: 28, fat: 8, fiber: 2, sodium: 115, serving: "1 bar" },
  "chocolate": { calories: 155, protein: 2, carbs: 17, fat: 9, fiber: 1, sodium: 10, serving: "1 oz" },
  "dark chocolate": { calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 3, sodium: 7, serving: "1 oz" },
  "ice cream": { calories: 270, protein: 5, carbs: 32, fat: 14, fiber: 1, sodium: 80, serving: "1 cup" },
  "frozen yogurt": { calories: 200, protein: 6, carbs: 36, fat: 3, fiber: 0, sodium: 100, serving: "1 cup" },
  "cookie": { calories: 160, protein: 2, carbs: 22, fat: 7, fiber: 1, sodium: 100, serving: "1 cookie" },
  "cookies": { calories: 320, protein: 4, carbs: 44, fat: 14, fiber: 2, sodium: 200, serving: "2 cookies" },
  "brownie": { calories: 230, protein: 3, carbs: 30, fat: 12, fiber: 1, sodium: 140, serving: "1 brownie" },
  "cake": { calories: 290, protein: 4, carbs: 40, fat: 14, fiber: 1, sodium: 250, serving: "1 slice" },
  "donut": { calories: 280, protein: 4, carbs: 33, fat: 15, fiber: 1, sodium: 250, serving: "1 donut" },
  "muffin": { calories: 340, protein: 6, carbs: 48, fat: 14, fiber: 2, sodium: 350, serving: "1 large" },
  "croissant": { calories: 230, protein: 5, carbs: 26, fat: 12, fiber: 1, sodium: 220, serving: "1 croissant" },
  "scone": { calories: 280, protein: 5, carbs: 36, fat: 13, fiber: 1, sodium: 320, serving: "1 scone" },
  "pie": { calories: 310, protein: 3, carbs: 42, fat: 15, fiber: 2, sodium: 230, serving: "1 slice" },
  "cheesecake": { calories: 400, protein: 7, carbs: 30, fat: 28, fiber: 0, sodium: 350, serving: "1 slice" },

  // === Legumes & Beans ===
  "black beans": { calories: 227, protein: 15, carbs: 41, fat: 1, fiber: 15, sodium: 1, serving: "1 cup" },
  "kidney beans": { calories: 225, protein: 15, carbs: 40, fat: 1, fiber: 11, sodium: 2, serving: "1 cup" },
  "chickpeas": { calories: 269, protein: 15, carbs: 45, fat: 4, fiber: 12, sodium: 11, serving: "1 cup" },
  "lentils": { calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16, sodium: 4, serving: "1 cup" },
  "refried beans": { calories: 237, protein: 14, carbs: 39, fat: 3, fiber: 13, sodium: 750, serving: "1 cup" },
  "baked beans": { calories: 240, protein: 12, carbs: 42, fat: 2, fiber: 10, sodium: 850, serving: "1 cup" },

  // === Fast Food Specific ===
  "big mac": { calories: 550, protein: 25, carbs: 46, fat: 30, fiber: 3, sodium: 1010, serving: "1 sandwich" },
  "quarter pounder": { calories: 520, protein: 30, carbs: 42, fat: 26, fiber: 2, sodium: 1100, serving: "1 sandwich" },
  "mcchicken": { calories: 400, protein: 14, carbs: 40, fat: 21, fiber: 2, sodium: 780, serving: "1 sandwich" },
  "chicken mcnuggets": { calories: 250, protein: 14, carbs: 15, fat: 15, fiber: 1, sodium: 500, serving: "6 piece" },
  "whopper": { calories: 660, protein: 28, carbs: 49, fat: 40, fiber: 2, sodium: 980, serving: "1 sandwich" },
  "subway 6 inch": { calories: 350, protein: 20, carbs: 44, fat: 8, fiber: 5, sodium: 800, serving: "6 inch" },
  "subway footlong": { calories: 700, protein: 40, carbs: 88, fat: 16, fiber: 10, sodium: 1600, serving: "footlong" },
  "chicken bowl": { calories: 500, protein: 35, carbs: 50, fat: 15, fiber: 5, sodium: 900, serving: "1 bowl" },
};

// === Quick Add Suggestions (popular meals) ===
const QUICK_ADD_MEALS = [
  "Grilled chicken breast, brown rice, broccoli",
  "Scrambled eggs, toast, banana",
  "Greek yogurt, granola, blueberries",
  "Salmon, quinoa, asparagus",
  "Protein shake, banana",
  "Turkey sandwich",
  "Chicken caesar salad",
  "Oatmeal, peanut butter, banana",
  "Steak, sweet potato, green beans",
  "Chipotle burrito bowl",
  "Avocado toast, 2 eggs",
  "Chicken stir fry, brown rice",
];

// === Recommendation Templates ===
const RECOMMENDATION_TEMPLATES = [
  {
    name: "Grilled Chicken & Rice Bowl",
    description: "Lean protein with complex carbs",
    items: "grilled chicken breast, brown rice, broccoli, olive oil",
    mealType: "lunch",
    macros: { calories: 500, protein: 40, carbs: 56, fat: 18, fiber: 9, sodium: 136 }
  },
  {
    name: "Salmon Power Plate",
    description: "Omega-3 rich with fiber-packed sides",
    items: "salmon, quinoa, asparagus, olive oil",
    mealType: "dinner",
    macros: { calories: 640, protein: 48, carbs: 44, fat: 33, fiber: 8, sodium: 76 }
  },
  {
    name: "Protein Oatmeal Bowl",
    description: "High-protein breakfast with sustained energy",
    items: "oatmeal, whey protein, banana, peanut butter",
    mealType: "breakfast",
    macros: { calories: 570, protein: 38, carbs: 64, fat: 20, fiber: 9, sodium: 275 }
  },
  {
    name: "Turkey & Avocado Wrap",
    description: "Balanced lunch with healthy fats",
    items: "turkey breast, avocado, tortilla, lettuce, tomato",
    mealType: "lunch",
    macros: { calories: 530, protein: 38, carbs: 38, fat: 25, fiber: 14, sodium: 470 }
  },
  {
    name: "Steak & Sweet Potato",
    description: "Classic muscle-building dinner",
    items: "sirloin steak, sweet potato, green beans, butter",
    mealType: "dinner",
    macros: { calories: 592, protein: 40, carbs: 72, fat: 18, fiber: 12, sodium: 136 }
  },
  {
    name: "Greek Yogurt Parfait",
    description: "High-protein snack with fiber",
    items: "greek yogurt, granola, mixed berries, honey",
    mealType: "snack",
    macros: { calories: 434, protein: 23, carbs: 63, fat: 13, fiber: 7, sodium: 71 }
  },
  {
    name: "Egg & Toast Breakfast",
    description: "Simple, balanced morning fuel",
    items: "3 eggs, whole wheat bread, avocado",
    mealType: "breakfast",
    macros: { calories: 536, protein: 25, carbs: 27, fat: 39, fiber: 14, sodium: 424 }
  },
  {
    name: "Chicken Stir-Fry",
    description: "Lean protein with veggies",
    items: "chicken stir fry, brown rice",
    mealType: "dinner",
    macros: { calories: 595, protein: 35, carbs: 75, fat: 16, fiber: 8, sodium: 860 }
  },
  {
    name: "Lentil Soup & Bread",
    description: "High-fiber plant-based option",
    items: "lentil soup, sourdough bread, olive oil",
    mealType: "lunch",
    macros: { calories: 409, protein: 19, carbs: 56, fat: 11, fiber: 11, sodium: 780 }
  },
  {
    name: "Tuna & Quinoa Bowl",
    description: "Low-fat, high-protein meal",
    items: "tuna, quinoa, edamame, soy sauce",
    mealType: "lunch",
    macros: { calories: 570, protein: 54, carbs: 53, fat: 13, fiber: 13, sodium: 960 }
  },
  {
    name: "Cottage Cheese & Fruit",
    description: "Quick high-protein snack",
    items: "cottage cheese, pineapple, chia seeds",
    mealType: "snack",
    macros: { calories: 402, protein: 30, carbs: 38, fat: 14, fiber: 11, sodium: 710 }
  },
  {
    name: "Peanut Butter Banana Shake",
    description: "Calorie-dense muscle-building shake",
    items: "protein shake, banana, peanut butter, oat milk",
    mealType: "snack",
    macros: { calories: 555, protein: 40, carbs: 53, fat: 21, fiber: 8, sodium: 490 }
  },
  {
    name: "Chicken & Black Bean Bowl",
    description: "High-fiber, high-protein tex-mex style",
    items: "chicken breast, black beans, rice, salsa, sour cream",
    mealType: "dinner",
    macros: { calories: 680, protein: 54, carbs: 89, fat: 11, fiber: 16, sodium: 505 }
  },
  {
    name: "Shrimp & Veggie Plate",
    description: "Low-calorie, high-protein dinner",
    items: "shrimp, brown rice, bell pepper, broccoli, soy sauce",
    mealType: "dinner",
    macros: { calories: 445, protein: 35, carbs: 63, fat: 5, fiber: 11, sodium: 1200 }
  },
  {
    name: "Overnight Oats",
    description: "Prep-ahead fiber-rich breakfast",
    items: "overnight oats, almond butter, blueberries",
    mealType: "breakfast",
    macros: { calories: 631, protein: 20, carbs: 71, fat: 31, fiber: 14, sodium: 102 }
  },
  {
    name: "Light Garden Salad & Chicken",
    description: "Low-calorie, filling lunch",
    items: "chicken breast, garden salad, balsamic vinaigrette",
    mealType: "lunch",
    macros: { calories: 325, protein: 34, carbs: 19, fat: 11, fiber: 6, sodium: 389 }
  },
];

// === Parser ===

/**
 * Parse a natural language meal description into individual food items with macros.
 * Returns { items: [{ name, matchedAs, macros, quantity }], totals: { ... } }
 */
function parseMealInput(input) {
  const raw = input.trim();
  if (!raw) return { items: [], totals: zeroMacros() };

  // Split by commas, newlines, "and", or "with"
  const parts = raw
    .split(/,|\n|(?:\band\b)/gi)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const items = parts.map(part => parseItem(part));
  const totals = sumMacros(items.map(i => i.macros));

  return { items, totals };
}

function parseItem(raw) {
  const cleaned = raw.trim().toLowerCase();

  // Try to extract quantity
  const { quantity, remainder } = extractQuantity(cleaned);

  // Try exact match first
  if (NUTRITION_DB[remainder]) {
    const macros = scaleMacros(NUTRITION_DB[remainder], quantity);
    return { name: raw.trim(), matchedAs: remainder, macros, quantity, serving: NUTRITION_DB[remainder].serving };
  }

  // Try fuzzy match
  const match = fuzzyMatch(remainder);
  if (match) {
    const macros = scaleMacros(NUTRITION_DB[match], quantity);
    return { name: raw.trim(), matchedAs: match, macros, quantity, serving: NUTRITION_DB[match].serving };
  }

  // Unknown food - return zero macros with flag
  return { name: raw.trim(), matchedAs: null, macros: zeroMacros(), quantity, unknown: true };
}

function extractQuantity(text) {
  // Match patterns like "2 eggs", "3 slices of bread", "1.5 cups rice"
  const qtyRegex = /^(\d+\.?\d*)\s*(oz|ounce|ounces|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|slice|slices|piece|pieces|serving|servings|scoop|scoops|g|gram|grams|ml|lb|lbs|pound|pounds)?\s*(of\s+)?/i;
  const match = text.match(qtyRegex);

  if (match && match[1]) {
    const num = parseFloat(match[1]);
    const remainder = text.slice(match[0].length).trim();

    if (remainder.length > 0) {
      return { quantity: num, remainder };
    }
  }

  // Check for word quantities: "a", "half", "large", "small"
  const wordQty = /^(a|one|half|two|three|four|five|six|double|triple|large|small|extra large)\s+/i;
  const wordMatch = text.match(wordQty);
  if (wordMatch) {
    const word = wordMatch[1].toLowerCase();
    const qtyMap = { a: 1, one: 1, half: 0.5, two: 2, three: 3, four: 4, five: 5, six: 6, double: 2, triple: 3, large: 1.3, small: 0.7, "extra large": 1.5 };
    const remainder = text.slice(wordMatch[0].length).trim();
    if (remainder.length > 0) {
      return { quantity: qtyMap[word] || 1, remainder };
    }
  }

  return { quantity: 1, remainder: text };
}

function fuzzyMatch(query) {
  const q = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (!q) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const key of Object.keys(NUTRITION_DB)) {
    const score = matchScore(q, key);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = key;
    }
  }

  // Require a minimum match quality
  return bestScore >= 0.5 ? bestMatch : null;
}

function matchScore(query, dbKey) {
  // Exact match
  if (query === dbKey) return 1;

  // Query contains the full db key
  if (query.includes(dbKey)) return 0.9;

  // DB key contains the full query
  if (dbKey.includes(query)) return 0.85;

  // Word-level matching
  const qWords = query.split(/\s+/);
  const kWords = dbKey.split(/\s+/);

  let matchedWords = 0;
  for (const qw of qWords) {
    for (const kw of kWords) {
      if (kw === qw) {
        matchedWords++;
        break;
      } else if (kw.startsWith(qw) || qw.startsWith(kw)) {
        matchedWords += 0.7;
        break;
      }
    }
  }

  // Score based on how many query words matched, weighted by total
  const coverage = matchedWords / Math.max(qWords.length, kWords.length);
  return coverage * 0.8;
}

function scaleMacros(base, quantity) {
  return {
    calories: Math.round(base.calories * quantity),
    protein: Math.round(base.protein * quantity * 10) / 10,
    carbs: Math.round(base.carbs * quantity * 10) / 10,
    fat: Math.round(base.fat * quantity * 10) / 10,
    fiber: Math.round(base.fiber * quantity * 10) / 10,
    sodium: Math.round(base.sodium * quantity),
  };
}

function zeroMacros() {
  return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 };
}

function sumMacros(macrosList) {
  const total = zeroMacros();
  for (const m of macrosList) {
    total.calories += m.calories;
    total.protein += m.protein;
    total.carbs += m.carbs;
    total.fat += m.fat;
    total.fiber += m.fiber;
    total.sodium += m.sodium;
  }
  // Round
  total.protein = Math.round(total.protein * 10) / 10;
  total.carbs = Math.round(total.carbs * 10) / 10;
  total.fat = Math.round(total.fat * 10) / 10;
  total.fiber = Math.round(total.fiber * 10) / 10;
  total.sodium = Math.round(total.sodium);
  return total;
}

// ============================================================
// API-backed Nutrition Lookup
// ============================================================

const USDA_API_KEY = 'DEMO_KEY';
const _apiCache = new Map();

function _round1(v) {
  return Math.round(v * 10) / 10;
}

async function _fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return resp;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/**
 * Check whether a product name is a reasonable match for the query.
 * Requires at least half of the significant query words to appear in the name.
 */
function _isRelevantMatch(query, productName) {
  if (!productName) return false;
  const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (qWords.length === 0) return true;
  const pName = productName.toLowerCase();
  const hits = qWords.filter(w => pName.includes(w)).length;
  return hits >= Math.ceil(qWords.length / 2);
}

/**
 * Search Open Food Facts for a food item.
 * Returns { macros, serving, source } per one serving or null.
 */
async function searchOpenFoodFacts(query) {
  const cacheKey = 'off:' + query.toLowerCase().trim();
  if (_apiCache.has(cacheKey)) return _apiCache.get(cacheKey);

  try {
    const url = 'https://world.openfoodfacts.org/cgi/search.pl'
      + '?search_terms=' + encodeURIComponent(query)
      + '&search_simple=1&action=process&json=1&page_size=5'
      + '&fields=product_name,nutriments,serving_size,serving_quantity';
    const resp = await _fetchWithTimeout(url, 4000);
    if (!resp.ok) return null;

    const data = await resp.json();
    if (!data.products || data.products.length === 0) return null;

    for (const product of data.products) {
      const n = product.nutriments;
      if (!n) continue;

      // Must have calories
      const hasPer100 = n['energy-kcal_100g'] != null && n['energy-kcal_100g'] > 0;
      const hasPerServing = n['energy-kcal_serving'] != null && n['energy-kcal_serving'] > 0;
      if (!hasPer100 && !hasPerServing) continue;

      // Must be relevant to query
      if (!_isRelevantMatch(query, product.product_name)) continue;

      // Determine serving size in grams
      let servingGrams = 100;
      if (product.serving_quantity) {
        servingGrams = parseFloat(product.serving_quantity) || 100;
      } else if (product.serving_size) {
        const gMatch = product.serving_size.match(/([\d.]+)\s*g/i);
        if (gMatch) servingGrams = parseFloat(gMatch[1]) || 100;
      }

      let macros;
      if (hasPer100) {
        // Scale per-100g values to one serving
        const f = servingGrams / 100;
        macros = {
          calories: Math.round((n['energy-kcal_100g'] || 0) * f),
          protein: _round1((n['proteins_100g'] || 0) * f),
          carbs:   _round1((n['carbohydrates_100g'] || 0) * f),
          fat:     _round1((n['fat_100g'] || 0) * f),
          fiber:   _round1((n['fiber_100g'] || 0) * f),
          sodium:  Math.round((n['sodium_100g'] || 0) * f * 1000), // g → mg
        };
      } else {
        macros = {
          calories: Math.round(n['energy-kcal_serving'] || 0),
          protein: _round1(n['proteins_serving'] || 0),
          carbs:   _round1(n['carbohydrates_serving'] || 0),
          fat:     _round1(n['fat_serving'] || 0),
          fiber:   _round1(n['fiber_serving'] || 0),
          sodium:  Math.round((n['sodium_serving'] || 0) * 1000),
        };
      }

      // Sanity: skip if calories are unreasonably high per serving (>2000)
      if (macros.calories > 2000) continue;

      const result = {
        macros,
        serving: product.serving_size || (servingGrams + 'g'),
        source: 'Open Food Facts',
      };
      _apiCache.set(cacheKey, result);
      return result;
    }

    _apiCache.set(cacheKey, null);
    return null;
  } catch (e) {
    console.warn('Open Food Facts lookup failed:', e.message);
    return null;
  }
}

/**
 * Search USDA FoodData Central for a food item.
 * Returns { macros, serving, source } per one serving or null.
 */
async function searchUSDA(query) {
  const cacheKey = 'usda:' + query.toLowerCase().trim();
  if (_apiCache.has(cacheKey)) return _apiCache.get(cacheKey);

  try {
    const url = 'https://api.nal.usda.gov/fdc/v1/foods/search'
      + '?api_key=' + USDA_API_KEY
      + '&query=' + encodeURIComponent(query)
      + '&pageSize=3'
      + '&dataType=Foundation,SR%20Legacy';
    const resp = await _fetchWithTimeout(url, 4000);
    if (!resp.ok) return null;

    const data = await resp.json();
    if (!data.foods || data.foods.length === 0) return null;

    const food = data.foods[0];
    const nutrients = food.foodNutrients || [];

    function getNutrient(name) {
      const n = nutrients.find(item => item.nutrientName === name);
      return n ? (n.value || 0) : 0;
    }

    // USDA values are per 100g
    const per100 = {
      calories: getNutrient('Energy'),
      protein:  getNutrient('Protein'),
      carbs:    getNutrient('Carbohydrate, by difference'),
      fat:      getNutrient('Total lipid (fat)'),
      fiber:    getNutrient('Fiber, total dietary'),
      sodium:   getNutrient('Sodium, Na'), // already mg per 100g
    };

    // Scale to serving
    const servingSize = food.servingSize || 100;
    const f = servingSize / 100;

    const macros = {
      calories: Math.round(per100.calories * f),
      protein:  _round1(per100.protein * f),
      carbs:    _round1(per100.carbs * f),
      fat:      _round1(per100.fat * f),
      fiber:    _round1(per100.fiber * f),
      sodium:   Math.round(per100.sodium * f),
    };

    const servingLabel = food.servingSizeUnit
      ? servingSize + food.servingSizeUnit
      : servingSize + 'g';

    const result = {
      macros,
      serving: servingLabel,
      source: 'USDA',
    };
    _apiCache.set(cacheKey, result);
    return result;
  } catch (e) {
    console.warn('USDA lookup failed:', e.message);
    return null;
  }
}

/**
 * Async version of parseItem: tries APIs first, then local DB fallback.
 * Returns the same shape as parseItem but adds a `source` field.
 */
async function parseItemAsync(raw) {
  const cleaned = raw.trim().toLowerCase();
  const { quantity, remainder } = extractQuantity(cleaned);

  // --- Try local DB first (instant, high confidence for known foods) ---
  if (NUTRITION_DB[remainder]) {
    const macros = scaleMacros(NUTRITION_DB[remainder], quantity);
    return {
      name: raw.trim(), matchedAs: remainder, macros, quantity,
      serving: NUTRITION_DB[remainder].serving, source: 'Estimated',
    };
  }
  const localFuzzy = fuzzyMatch(remainder);
  if (localFuzzy && matchScore(remainder, localFuzzy) >= 0.8) {
    // High-confidence local match — use it without API call
    const macros = scaleMacros(NUTRITION_DB[localFuzzy], quantity);
    return {
      name: raw.trim(), matchedAs: localFuzzy, macros, quantity,
      serving: NUTRITION_DB[localFuzzy].serving, source: 'Estimated',
    };
  }

  // --- Try Open Food Facts ---
  const offResult = await searchOpenFoodFacts(remainder);
  if (offResult) {
    const macros = scaleMacros(offResult.macros, quantity);
    return {
      name: raw.trim(), matchedAs: remainder, macros, quantity,
      serving: offResult.serving, source: offResult.source,
    };
  }

  // --- Try USDA ---
  const usdaResult = await searchUSDA(remainder);
  if (usdaResult) {
    const macros = scaleMacros(usdaResult.macros, quantity);
    return {
      name: raw.trim(), matchedAs: remainder, macros, quantity,
      serving: usdaResult.serving, source: usdaResult.source,
    };
  }

  // --- Low-confidence local fuzzy match ---
  if (localFuzzy) {
    const macros = scaleMacros(NUTRITION_DB[localFuzzy], quantity);
    return {
      name: raw.trim(), matchedAs: localFuzzy, macros, quantity,
      serving: NUTRITION_DB[localFuzzy].serving, source: 'Estimated',
    };
  }

  // --- Completely unknown ---
  return {
    name: raw.trim(), matchedAs: null, macros: zeroMacros(), quantity,
    unknown: true, source: 'Unknown',
  };
}

/**
 * Async version of parseMealInput: resolves all items via API + fallback.
 * Returns { items, totals } — same shape as the sync version.
 */
async function parseMealInputAsync(input) {
  const raw = input.trim();
  if (!raw) return { items: [], totals: zeroMacros() };

  const parts = raw
    .split(/,|\n|(?:\band\b)/gi)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const items = await Promise.all(parts.map(part => parseItemAsync(part)));
  const totals = sumMacros(items.map(i => i.macros));

  return { items, totals };
}
