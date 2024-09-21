class AppDOMManager {
  constructor() {
    this.initAppElements();
  }

  initAppElements() {
    // DOM elements
    this.searchRecipesDownloadText = document.getElementById(
      "search_recipes_download_text"
    );
    this.searchRecipesDownloadProgress = document.getElementById(
      "search_recipes_download_progress"
    );
    this.favoriteRecipesDownloadProgress = document.getElementById(
      "favorite_recipes_download_progress"
    );
    this.noSearchRecipesText = document.getElementById(
      "no_search_recipes_text"
    );
    this.uploadedImage = document.getElementById("uploaded_image");
    this.dietCheckboxes = document.getElementsByClassName(
      "restriction-checkbox"
    );
    this.intolerancesCheckboxes = document.getElementsByClassName(
      "intolerance-checkbox"
    );
    this.imageRecognitionStatusText = document.getElementById(
      "image_recognition_status"
    );
    this.imageRecognitionFailedText = document.getElementById(
      "image_recognition_failed"
    );
    this.emptyFavoriteTextContainer = document.getElementById(
      "empty_favorite_text_container"
    );
    this.favoriteRecipesStatusText = document.getElementById(
      "favorite_recipes_status_text"
    );
    this.searchResultsQuantityDiv = document.getElementById(
      "search_results_quantity_div"
    );
    this.resultsShownQuantityDiv = document.getElementById(
      "results_shown_quantity_div"
    );
    this.imgurAPIError = document.getElementById("imgur_api_error");
    this.spoonacularSearchError = document.getElementById(
      "spoonacular_search_error"
    );
    this.spoonacularFavoriteError = document.getElementById(
      "spoonacular_favorite_error"
    );
    this.spoonacularFavoriteTimeoutError = document.getElementById(
      "spoonacular_favorite_timeout_error"
    );
    this.titleContainer = document.getElementById("title_container");
    this.percentageBarContainer = document.getElementById(
      "percentage_bar_container"
    );
    this.uploadedImageContainer = document.getElementById(
      "uploaded_image_container"
    );
    this.formElement = document.getElementById("form");
    this.favoriteRecipesSection = document.getElementById(
      "favorite_recipes_section"
    );
    this.inputs = document.querySelectorAll(".input");
    this.searchRecipesDownloadContainer = document.getElementById(
      "search_recipes_download_container"
    );
    this.imageProcessingContainer = document.getElementById(
      "image_processing_container"
    );
    this.dietMenu = document.getElementById("diet_menu");
    this.closePreviewXButton = document.getElementById(
      "close_preview_x_button"
    );
    this.recipeInformation = null;
    // this.spoonacularError = null;

    this.dataForImageRecognition = {
      requests: [
        {
          image: {
            source: {
              imageUri: null,
            },
          },
          features: [
            {
              type: "LABEL_DETECTION",
            },
          ],
        },
      ],
    };

    this.spoonacularDataToSend = {
      diet: null,
      intolerances: null,
    };
  }
}

class FormDOMManager {
  constructor() {
    this.initFormElements();
  }

  initFormElements() {
    // DOM elements
    this.fileLabel = document.getElementById("custom_file_label");
    this.fileInputForm = document.getElementById("file_input_form");
    this.recipeSearchInput = document.getElementById("recipe_search_input");
    // this.resetButton = document.getElementById("reset_button");
    this.searchButton = document.getElementById("search_button");
    this.toggleFavoritesButton = document.getElementById(
      "toggle_favorites_button"
    );
    this.toggleDietButton = document.getElementById("toggle_diet_button");
    this.mainContent = document.getElementById("main_content");
    this.errorContainer = document.getElementById("error_container");
    this.errorSpoonacularSearch = document.getElementById(
      "spoonacular_search_error"
    );
    this.errorImgurCORSIssue = document.getElementById("imgur_api_error");
    this.errorNoFile = document.getElementById("error_no_file");
    this.errorIncorrectFile = document.getElementById("error_incorrect_file");
    this.errorFileExceedsSize = document.getElementById(
      "error_file_exceeds_size"
    );
    this.errorNoSearchResults = document.getElementById(
      "no_search_recipes_text"
    );
    this.openSideMenuButton = document.getElementById("open_side_menu_button");
    this.closeSideMenuButton = document.getElementById(
      "close_side_menu_button"
    );
    this.sideMenuContainer = document.getElementById("side_menu_container");
    this.userInputContainer = document.getElementById("user_input_container");
    this.headerElement = document.getElementById("header_element");
    this.favoriteStickyDiv = document.getElementById("favorite_sticky_div");
  }
}

class RecipesHandlerDOMManager {
  constructor() {
    this.initRecipeElements();
  }

  initRecipeElements() {
    this.searchResultsQuantityText = document.getElementById(
      "search_results_quantity_text"
    );
    this.modalContainer = document.getElementById("modal_container");
    this.resultsShownQuantityText = document.getElementById(
      "results_shown_quantity_text"
    );
    this.body = document.querySelector("body");
    // this.favoriteButton = document.getElementById("favorite_button");
    this.backToTopButton = document.getElementById("back_to_top_button");
    if (!this.backToTopButton) {
      console.error("Element with ID 'backToTopButton' not found.");
    }
    this.recipeInstructions = document.getElementById("recipe_instructions");
    this.recipeIngredients = document.getElementById("recipe_ingredients");
    this.modalButtonContainer = document.getElementById(
      "modal_button_container"
    );
    this.overlayPreview = document.getElementById("overlay_preview");
    this.modalDialog = document.getElementById("modal_dialog");
  }
}

export class DOMManager {
  constructor() {
    this.app = new AppDOMManager();
    this.form = new FormDOMManager();
    this.recipes = new RecipesHandlerDOMManager();
  }
}
