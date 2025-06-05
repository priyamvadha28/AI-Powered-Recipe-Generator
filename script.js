// --- DOM Elements ---
const DOM = {
    ingredientInput: document.getElementById('ingredientInput'),
    hiddenIngredientsInput: document.getElementById('hiddenIngredientsInput'),
    ingredientsTagsContainer: document.getElementById('ingredientsTagsContainer'),
    autocompleteSuggestions: document.getElementById('autocompleteSuggestions'),

    cuisineInput: document.getElementById('cuisineInput'),
    dietaryInput: document.getElementById('dietaryInput'),
    mealTypeInput: document.getElementById('mealTypeInput'),

    generateButton: document.getElementById('generateButton'),
    luckyButton: document.getElementById('luckyButton'),
    buttonText: document.getElementById('buttonText'),
    loadingSpinner: document.getElementById('loadingSpinner'),

    errorMessageDiv: document.getElementById('errorMessage'),
    errorTextSpan: document.getElementById('errorText'),

    recipeOutputContainer: document.getElementById('recipeOutputContainer'),
    recipeOutput: document.getElementById('recipeOutput'),
    copyRecipeButton: document.getElementById('copyRecipeButton'),
    clearAllButton: document.getElementById('clearAllButton'),
    downloadPdfButton: document.getElementById('downloadPdfButton')
};

// --- API Configuration ---
const API_CONFIG = {
    endpoint: "xxxx",
    apiKey: "xxxxx"
};

// --- Autocomplete Ingredients List ---
const COMMON_INGREDIENTS = [
    // Proteins
    'chicken', 'beef', 'pork', 'fish', 'shrimp', 'tofu', 'eggs', 'bacon', 'sausage',
    'ham', 'turkey', 'lamb', 'ground beef', 'chorizo', 'salami',

    // Vegetables
    'broccoli', 'tomatoes', 'onions', 'garlic', 'potatoes', 'carrots', 'bell peppers',
    'spinach', 'mushrooms', 'zucchini', 'cabbage', 'cucumber', 'lettuce', 'kale',
    'sweet potatoes', 'asparagus', 'corn', 'peas', 'green beans', 'cauliflower',
    'brussels sprouts', 'eggplant', 'celery', 'avocado', 'olives',

    // Fruits
    'apples', 'bananas', 'berries', 'lemon', 'lime', 'oranges', 'grapes', 'mango',
    'pineapple', 'strawberries', 'blueberries', 'raspberries', 'peaches', 'pears',
    'watermelon', 'melon', 'kiwi',

    // Grains & Starches
    'rice', 'pasta', 'bread', 'oats', 'quinoa', 'couscous', 'flour', 'cornmeal',
    'tortillas', 'noodles', 'baguette', 'pita bread', 'rice noodles',

    // Dairy & Alternatives
    'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'cream cheese',
    'parmesan', 'cheddar', 'mozzarella', 'feta', 'almond milk', 'soy milk', 'oat milk',

    // Fats & Oils
    'olive oil', 'vegetable oil', 'coconut oil', 'sesame oil', 'margarine', 'lard',

    // Spices & Herbs
    'salt', 'pepper', 'sugar', 'cilantro', 'parsley', 'thyme', 'oregano', 'cumin',
    'paprika', 'chili powder', 'ginger', 'turmeric', 'rosemary', 'basil', 'dill',
    'bay leaf', 'cinnamon', 'nutmeg', 'garlic powder', 'onion powder', 'red pepper flakes',
    'curry powder', 'cardamom', 'cloves', 'allspice',

    // Condiments & Sauces
    'soy sauce', 'vinegar', 'honey', 'maple syrup', 'mustard', 'ketchup', 'mayonnaise',
    'hot sauce', 'worcestershire sauce', 'sriracha', 'hoisin sauce', 'fish sauce',
    'tahini', 'peanut butter', 'jam', 'pesto', 'tomato paste', 'broth', 'stock',

    // Nuts & Seeds
    'nuts', 'almonds', 'walnuts', 'peanuts', 'cashews', 'chia seeds', 'flax seeds',
    'sesame seeds', 'sunflower seeds',

    // Legumes
    'beans', 'lentils', 'chickpeas', 'black beans', 'kidney beans', 'pinto beans',

    // Misc.
    'broth', 'coconut milk', 'yeast', 'baking soda', 'baking powder', 'vanilla extract',
    'chocolate', 'cocoa powder', 'coffee', 'tea', 'wine', 'beer', 'vinegar'

].sort();

// --- State Variables ---
let currentIngredients = new Set();
let debounceTimeout;

// --- UI Utility Functions ---
function displayError(message) {
    DOM.errorTextSpan.textContent = message;
    DOM.errorMessageDiv.classList.remove('hidden');
}

function clearError() {
    DOM.errorMessageDiv.classList.add('hidden');
    DOM.errorTextSpan.textContent = '';
}

function setLoadingState(isLoading) {
    DOM.generateButton.disabled = isLoading;
    DOM.luckyButton.disabled = isLoading;
    if (isLoading) {
        DOM.generateButton.classList.add('bg-purple-400', 'cursor-not-allowed', 'animate-pulse');
        DOM.generateButton.classList.remove('generate-button'); // Ensure custom styles are removed
        DOM.buttonText.classList.add('hidden');
        DOM.loadingSpinner.classList.remove('hidden');
    } else {
        DOM.generateButton.classList.remove('bg-purple-400', 'cursor-not-allowed', 'animate-pulse');
        DOM.generateButton.classList.add('generate-button'); // Add custom styles back
        DOM.buttonText.classList.remove('hidden');
        DOM.loadingSpinner.classList.add('hidden');
    }
}

function showRecipeControls(show) {
    DOM.recipeOutputContainer.classList.toggle('hidden', !show);
    DOM.copyRecipeButton.classList.toggle('hidden', !show);
    DOM.clearAllButton.classList.toggle('hidden', !show);
    DOM.downloadPdfButton.classList.toggle('hidden', !show);
}

// --- Ingredient Management Module ---
const IngredientManager = {
    addTag: function(ingredient) {
        ingredient = ingredient.trim().toLowerCase();
        if (ingredient && !currentIngredients.has(ingredient)) {
            currentIngredients.add(ingredient);

            const tag = document.createElement('span');
            tag.className = 'ingredient-tag inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white';
            tag.textContent = ingredient;

            const removeButton = document.createElement('button');
            removeButton.className = 'ml-2 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200';
            removeButton.innerHTML = '<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            removeButton.onclick = () => this.removeTag(ingredient, tag);

            tag.appendChild(removeButton);
            DOM.ingredientsTagsContainer.appendChild(tag);

            this.updateHiddenInput();
            clearError();
        }
    },

    removeTag: function(ingredient, tagElement) {
        currentIngredients.delete(ingredient);
        tagElement.remove();
        this.updateHiddenInput();
        if (currentIngredients.size === 0) {
            displayError('Please enter at least some ingredients to generate a recipe.');
        }
    },

    updateHiddenInput: function() {
        DOM.hiddenIngredientsInput.value = Array.from(currentIngredients).join(', ');
    },

    clearAll: function() {
        currentIngredients.clear();
        DOM.ingredientsTagsContainer.innerHTML = '';
        this.updateHiddenInput();
    }
};

// --- Autocomplete Logic ---
DOM.ingredientInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = DOM.ingredientInput.value.trim().toLowerCase();
        DOM.autocompleteSuggestions.innerHTML = '';
        DOM.autocompleteSuggestions.classList.add('hidden'); // Hide by default

        if (query.length > 1) {
            const filteredSuggestions = COMMON_INGREDIENTS.filter(ingredient =>
                ingredient.startsWith(query) && !currentIngredients.has(ingredient)
            );

            if (filteredSuggestions.length > 0) {
                DOM.autocompleteSuggestions.classList.remove('hidden');
                filteredSuggestions.slice(0, 5).forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'p-2 cursor-pointer hover:bg-purple-700 text-white';
                    suggestionItem.textContent = suggestion;
                    suggestionItem.onclick = () => {
                        IngredientManager.addTag(suggestion);
                        DOM.ingredientInput.value = '';
                        DOM.autocompleteSuggestions.classList.add('hidden');
                    };
                    DOM.autocompleteSuggestions.appendChild(suggestionItem);
                });
            }
        }
    }, 200);
});

// Hide autocomplete when clicking outside
document.addEventListener('click', (event) => {
    if (!DOM.ingredientInput.contains(event.target) && !DOM.autocompleteSuggestions.contains(event.target)) {
        DOM.autocompleteSuggestions.classList.add('hidden');
    }
});

DOM.ingredientInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const value = DOM.ingredientInput.value.trim();
        if (value) {
            IngredientManager.addTag(value);
            DOM.ingredientInput.value = '';
            DOM.autocompleteSuggestions.classList.add('hidden');
        }
    }
});

/**
 * Converts Markdown text to HTML.
 * Basic conversion for common recipe formatting (headings, lists).
 * @param {string} markdown - The markdown string.
 * @returns {string} HTML string.
 */
function markdownToHtml(markdown) {
    let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3 for sub-sections
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')   // H2 for main sections
        .replace(/^\* (.*$)/gim, '<li>$1</li>')    // Unordered list items
        .replace(/^- (.*$)/gim, '<li>$1</li>')     // Another common unordered list syntax
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>'); // Ordered list items

    // Add replacement for **bold** text
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>'); // **text** to <strong>text</strong>

    // Wrap list items in ul/ol tags where appropriate. This is a very basic approach.
    html = html.replace(/(<li>.*<\/li>(\n)?)+/gim, (match) => {
        // Check if the match contains numbered list items, if so, wrap in <ol>
        if (match.split('\n').some(line => /^\d+\./.test(line.trim()))) {
            return '<ol>' + match + '</ol>';
        }
        // Otherwise, wrap in <ul>
        return '<ul>' + match + '</ul>';
    });

    // Handle paragraphs (lines not starting with markdown syntax or already handled tags)
    html = html.split('\n').map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.startsWith('<h') || trimmedLine.startsWith('<ul') || trimmedLine.startsWith('<ol') || trimmedLine.startsWith('<strong')) {
            return line; // Exclude lines that are already part of a strong tag
        }
        return '<p>' + line + '</p>';
    }).join('');

    return html;
}

// --- API Interaction & Recipe Generation ---
function validateApiConfig() {
    if (API_CONFIG.endpoint.includes('YOUR_AZURE_OPENAI_CHAT_COMPLETION_ENDPOINT_HERE') || API_CONFIG.apiKey.includes('YOUR_AZURE_OPENAI_API_KEY_HERE')) {
        displayError('Please configure your Azure OpenAI API Endpoint and Key in the JavaScript code.');
        return false;
    }
    return true;
}

/**
 * Constructs the prompt for the AI based on user inputs.
 * @returns {string} The formatted prompt string.
 */
function constructPrompt() {
    const ingredients = DOM.hiddenIngredientsInput.value.trim();
    const cuisine = DOM.cuisineInput.value.trim();
    const dietary = DOM.dietaryInput.value.trim();
    const mealType = DOM.mealTypeInput.value.trim();

    let prompt = `Generate a recipe. The recipe should include a creative title, a list of ingredients with quantities, and clear, numbered step-by-step instructions.`;

    if (ingredients) {
        prompt += ` Use these ingredients: ${ingredients}.`;
    }
    if (cuisine) {
        prompt += ` Make it ${cuisine} style.`;
    }
    if (dietary) {
        prompt += ` It must be ${dietary}.`;
    }
    if (mealType) {
        prompt += ` It should be a ${mealType} recipe.`;
    }

    prompt += ` Format the recipe using markdown for clarity: use a heading for the title (e.g., Recipe Title), a sub-heading for ingredients (e.g., Ingredients), a list for ingredients (e.g., * 1 cup flour), a sub-heading for instructions (e.g., Instructions), and a numbered list for steps (e.g., 1. First step). Make sure any bold text in the recipe is formatted using **double asterisks** for bolding (e.g., **Preheat the oven**).`;

    return prompt;
}

/**
 * Handles the recipe generation process.
 * Calls the Azure OpenAI API to generate a recipe.
 */
async function generateRecipe() {
    if (!validateApiConfig()) {
        return;
    }

    if (currentIngredients.size < 2) {
        displayError('Please enter at least two ingredients to generate a more meaningful recipe.');
        return;
    }

    setLoadingState(true);
    clearError();
    showRecipeControls(false); // Hide previous recipe and controls

    try {
        const prompt = constructPrompt();

        const payload = {
            messages: [
                { role: "system", content: "You are a helpful culinary assistant that generates creative and practical recipes. Provide clear titles, ingredient lists with common quantities, and numbered step-by-step instructions. If a requested ingredient is unusual, suggest a common substitute." },
                { role: "user", content: prompt }
            ],
            max_tokens: 800,
            temperature: 0.7,
        };

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_CONFIG.apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        let generatedText = '';

        if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
            generatedText = result.choices[0].message.content.trim();
        } else {
            throw new Error('No recipe content found in the API response.');
        }

        if (generatedText) {
            DOM.recipeOutput.innerHTML = markdownToHtml(generatedText);
            showRecipeControls(true); // Show recipe and controls
        } else {
            displayError('AI generated an empty recipe. Please try a different prompt.');
        }

    } catch (err) {
        console.error('Error generating recipe with Azure API:', err);
        displayError(`Failed to generate recipe: ${err.message}. Please check your Azure API configuration and network.`);
    } finally {
        setLoadingState(false);
    }
}

// --- Event Handlers ---
/**
 * Handles the "Feeling Lucky" button click.
 * Populates ingredients with random common items and generates a recipe.
 */
function handleLuckyClick() {
    clearAll(); // Clear existing inputs
    const numIngredients = Math.floor(Math.random() * 3) + 2; // 2 to 4 random ingredients
    const shuffledIngredients = [...COMMON_INGREDIENTS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numIngredients; i++) {
        IngredientManager.addTag(shuffledIngredients[i]);
    }
    // You could also randomly populate cuisine, dietary, mealType if desired
    generateRecipe();
}

/**
 * Copies the recipe output to the clipboard.
 */
async function copyRecipe() {
    try {
        const recipeText = DOM.recipeOutput.innerText; // Get plain text from the recipe output
        await navigator.clipboard.writeText(recipeText);
        DOM.copyRecipeButton.textContent = 'Copied!';
        setTimeout(() => {
            DOM.copyRecipeButton.textContent = 'Copy Recipe';
        }, 2000); // Revert button text after 2 seconds
    } catch (err) {
        console.error('Failed to copy recipe: ', err);
        displayError('Failed to copy recipe to clipboard.');
    }
}

/**
 * Clears all input fields and recipe output.
 */
function clearAll() {
    DOM.ingredientInput.value = '';
    IngredientManager.clearAll();

    DOM.cuisineInput.value = '';
    DOM.dietaryInput.value = '';
    DOM.mealTypeInput.value = '';

    DOM.recipeOutput.innerHTML = '';
    showRecipeControls(false); // Hide recipe and controls
    clearError();
}

/**
 * Dynamically loads a JavaScript script.
 * @param {string} src - The URL of the script to load.
 * @returns {Promise<void>} A promise that resolves when the script is loaded.
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Script loaded successfully: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Error loading script: ${src}`);
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(script);
    });
}

/**
 * Downloads the recipe output as a PDF.
 */
async function downloadRecipeAsPdf() {
    try {
        // Dynamically load jsPDF if it's not already available
        if (typeof window.jsPDF === 'undefined') {
            console.log("jsPDF not found, attempting to load dynamically...");
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }

        // After loading, verify it's now available
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('jsPDF library still not available after dynamic load attempt.');
        }

        const recipeTitleElement = DOM.recipeOutputContainer.querySelector('h2');
        const recipeContentElement = DOM.recipeOutput;

        if (!recipeTitleElement || !recipeContentElement || recipeContentElement.innerText.trim() === '') {
            console.error('Recipe content is empty or not found for PDF generation.');
            displayError('No recipe content to download as PDF.');
            return;
        }

        const recipeTitle = recipeTitleElement.textContent.trim() || 'Recipe';
        const recipeContent = recipeContentElement.innerText; // Get plain text

        // Access the jsPDF constructor from the window object
        const { jsPDF } = window; 
        const pdf = new jsPDF();

        pdf.setFontSize(22);
        pdf.text(recipeTitle, 15, 20);

        pdf.setFontSize(12);
        let y = 35;

        const pageWidth = pdf.internal.pageSize.getWidth() - 30;

        const lines = pdf.splitTextToSize(recipeContent, pageWidth);

        for (const line of lines) {
            if (y > pdf.internal.pageSize.getHeight() - 15) {
                pdf.addPage();
                y = 15;
            }
            pdf.text(line, 15, y);
            y += 7;
        }

        const filename = `${recipeTitle.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.pdf`;
        pdf.save(filename);
    } catch (err) {
        console.error('Error in PDF generation:', err);
        displayError(`Failed to download PDF: ${err.message}.`);
    }
}

// --- Initialization ---
function initialize() {
    // Add event listeners
    DOM.generateButton.addEventListener('click', generateRecipe);
    DOM.luckyButton.addEventListener('click', handleLuckyClick);
    DOM.copyRecipeButton.addEventListener('click', copyRecipe);
    DOM.clearAllButton.addEventListener('click', clearAll);
    DOM.downloadPdfButton.addEventListener('click', downloadRecipeAsPdf);

    // Clear error when inputs change
    DOM.ingredientInput.addEventListener('input', clearError);
    DOM.cuisineInput.addEventListener('input', clearError);
    DOM.dietaryInput.addEventListener('input', clearError);
    DOM.mealTypeInput.addEventListener('input', clearError);

    // Initial state setup
    IngredientManager.updateHiddenInput(); // Ensure hidden input is consistent with currentIngredients
    showRecipeControls(false); // Hide recipe and controls initially
}

// Call initialize when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', initialize);