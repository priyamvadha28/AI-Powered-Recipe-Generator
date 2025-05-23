# AI-Powered-Recipe-Generator

## Project Overview

Welcome to the AI Powered Recipe Generator! This is an interactive web application designed to help you whip up delicious meals using the ingredients you already have. Say goodbye to food waste and recipe block! Simply input your available ingredients, and our intelligent AI, powered by Azure OpenAI, will craft a unique and practical recipe tailored to your needs. You can refine your search with preferences for cuisine, dietary restrictions, or meal type, or embrace culinary serendipity with the "Surprise Me!" option.

The application focuses on providing clear, easy-to-follow recipes, complete with a creative title, a detailed ingredient list, and numbered step-by-step instructions.

## Features

* **Smart Ingredient Management:**
    * Dynamic input field with autocomplete suggestions for common ingredients.
    * Ingredients are added as interactive tags, allowing for easy visual management and removal.
* **Customizable Recipe Generation:**
    * **Cuisine Preference:** Specify a desired culinary style (e.g., Italian, Mexican, Indian).
    * **Dietary Restrictions:** Cater to specific needs (e.g., vegetarian, gluten-free, low-carb).
    * **Meal Type:** Define the occasion (e.g., dinner, breakfast, dessert).
* **"Surprise Me!" Feature:** Generates a random recipe using a selection of common ingredients, perfect for when inspiration strikes.
* **Clear & Formatted Output:** Recipes are presented in a well-structured, readable format using basic Markdown rendering.
* **Convenient Recipe Actions:**
    * **Copy Recipe:** Instantly copy the entire recipe text to your clipboard.
    * **Download PDF:** Save the generated recipe as a neat PDF document for offline access or printing.
    * **Start Afresh!:** Quickly clear all inputs and the recipe output to begin a new search.
* **Responsive User Interface:** Designed with Tailwind CSS to look great and be usable across various devices and screen sizes.
* **Robust User Feedback:** Features animated loading indicators during AI processing and clear error messages for issues like missing ingredients or API configuration problems.

## Technologies Used

* **HTML5:** Provides the foundational structure of the web application.
* **CSS3:** Custom styles to enhance the visual appeal and user experience.
* **JavaScript (ES6+):** Powers all the interactive elements, user input handling, and communication with the AI service.
* **Tailwind CSS (via CDN):** A utility-first CSS framework used for rapid and consistent UI styling.
* **jsPDF Library (via CDN):** A client-side JavaScript library for generating PDF documents directly in the browser.
* **Azure OpenAI API:** The powerful backend Large Language Model (LLM) responsible for generating the recipe content.

## Setup and Installation

This project is a static front-end web application. No complex backend server is required for its operation.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    ```
    Replace `<your-repository-url>` with the actual URL of your project's Git repository.

2.  **Navigate to the Project Directory:**
    ```bash
    cd <your-project-folder>
    ```

3.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser. The application should load directly.

    * **Note for Local Server (Optional but Recommended for Development):** While you can open `index.html` directly, some browser security policies (especially regarding `Workspace` API calls to external services like Azure OpenAI) might impose CORS restrictions. For smoother local development, it's often best to serve the files using a simple local web server.
        If you have Python installed, you can run:
        ```bash
        python -m http.server 8000
        ```
        Then, access the application by navigating to `http://localhost:8000` in your browser.

## API Key Configuration

For the AI recipe generation functionality to work, you must integrate your Azure OpenAI service credentials into the `script.js` file.

1.  **Obtain Azure OpenAI Credentials:**
    * Ensure you have an active Azure subscription and access to the Azure OpenAI Service.
    * Deploy a suitable language model (e.g., `gpt-4o-mini`, `gpt-3.5-turbo`) within your Azure OpenAI instance.
    * From your deployment, retrieve your **Endpoint URL** and an **API Key**.

2.  **Update `script.js`:**
    Open the `script.js` file and carefully replace the placeholder values with your actual Azure OpenAI Endpoint and API Key.

## Usage

1.  **Input Ingredients:** Start typing ingredients into the "Ingredients on hand" field. As you type, you'll see autocomplete suggestions. Press `Enter` or `,` (comma) to add an ingredient as a tag.
2.  **Add Preferences (Optional):** Use the "Cuisine Preference," "Dietary Restrictions," and "Meal Type" fields to refine your recipe request. These are optional and can be left blank.
3.  **Generate a Recipe:**
    * Click the **"Generate Recipe"** button to get a recipe based on your entered ingredients and preferences.
    * Click the **"Surprise Me!"** button for a completely random recipe.
4.  **Manage Generated Recipes:**
    * **"Copy Recipe"**: Copies the entire recipe text to your clipboard.
    * **"Download PDF"**: Downloads the displayed recipe as a PDF document.
    * **"Start Afresh!"**: Clears all input fields and the displayed recipe, allowing you to generate a new one.

## Notes

* **Minimum Ingredients:** The generator requires at least two ingredients to provide a more meaningful recipe.
* **Internet Connection:** An active internet connection is required to communicate with the Azure OpenAI API.
* **Customization:** Feel free to expand the `commonIngredients` list in `script.js` to enhance autocomplete suggestions.
* **Markdown Conversion:** The current markdown-to-HTML conversion is basic, suitable for recipe structures. For more complex markdown, a dedicated library would be needed.

## Author

This project is developed and maintained by **Priyamvadha Pradeep**.
