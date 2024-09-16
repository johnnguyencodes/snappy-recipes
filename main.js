class AppStateManager {
  constructor() {
    // state
    this.favoriteArray = [];
    this.restrictionsString = "";
    this.intolerancesString = "";
    this.chunkedRecipeArray = [];
    this.chunkedRecipeArrayIndex = 0;
    this.favoriteYPosition = null;
    this.rect = {};
    // array of top 1000 common ingredients
    const ingredients = [
      "apple",
      "banana",
      "orange",
      "lemon",
      "lime",
      "garlic",
      "onion",
      "tomato",
      "potato",
      "carrot",
      "broccoli",
      "cauliflower",
      "bell pepper",
      "spinach",
      "kale",
      "lettuce",
      "cucumber",
      "zucchini",
      "eggplant",
      "avocado",
      "mushrooms",
      "celery",
      "corn",
      "peas",
      "green beans",
      "asparagus",
      "sweet potato",
      "radish",
      "beets",
      "butternut squash",
      "pumpkin",
      "ginger",
      "parsley",
      "cilantro",
      "basil",
      "oregano",
      "thyme",
      "rosemary",
      "dill",
      "mint",
      "chives",
      "scallions",
      "leeks",
      "chili peppers",
      "jalapeno",
      "serrano peppers",
      "habanero",
      "cayenne pepper",
      "paprika",
      "cumin",
      "coriander",
      "turmeric",
      "curry powder",
      "cinnamon",
      "nutmeg",
      "cloves",
      "cardamom",
      "bay leaves",
      "black pepper",
      "white pepper",
      "red pepper flakes",
      "salt",
      "sugar",
      "honey",
      "maple syrup",
      "agave syrup",
      "vinegar (white, balsamic, red wine)",
      "olive oil",
      "coconut oil",
      "vegetable oil",
      "butter",
      "margarine",
      "cream",
      "milk",
      "yogurt",
      "sour cream",
      "mayonnaise",
      "ketchup",
      "mustard",
      "barbecue sauce",
      "soy sauce",
      "fish sauce",
      "hot sauce",
      "worcestershire sauce",
      "tahini",
      "peanut butter",
      "almond butter",
      "jam",
      "jelly",
      "marmalade",
      "bread",
      "flour",
      "whole wheat flour",
      "cornmeal",
      "baking powder",
      "baking soda",
      "yeast",
      "cornstarch",
      "oats",
      "quinoa",
      "rice (white, brown)",
      "pasta",
      "couscous",
      "bulgur",
      "farro",
      "barley",
      "lentils",
      "chickpeas",
      "black beans",
      "kidney beans",
      "pinto beans",
      "cannellini beans",
      "lima beans",
      "split peas",
      "tofu",
      "tempeh",
      "seitan",
      "chicken breast",
      "chicken thigh",
      "chicken wings",
      "chicken drumsticks",
      "whole chicken",
      "turkey",
      "ground turkey",
      "ground beef",
      "steak",
      "ribeye",
      "filet mignon",
      "sirloin",
      "pork chops",
      "bacon",
      "ham",
      "sausage",
      "ground pork",
      "lamb",
      "lamb chops",
      "ground lamb",
      "salmon",
      "tuna",
      "cod",
      "haddock",
      "shrimp",
      "scallops",
      "crab",
      "lobster",
      "clams",
      "mussels",
      "oysters",
      "eggs",
      "cheese (cheddar, mozzarella, parmesan, etc.)",
      "ricotta",
      "cottage cheese",
      "feta",
      "blue cheese",
      "goat cheese",
      "brie",
      "gouda",
      "swiss cheese",
      "cream cheese",
      "sour cream",
      "parmesan",
      "mozzarella",
      "heavy cream",
      "half-and-half",
      "milk (whole, 2%, skim, almond, soy, oat)",
      "egg whites",
      "egg yolks",
      "pancetta",
      "prosciutto",
      "salami",
      "pepperoni",
      "capicola",
      "shrimp",
      "crabmeat",
      "scallops",
      "lobster",
      "mussels",
      "clams",
      "sardines",
      "anchovies",
      "tuna (canned)",
      "mackerel",
      "squid",
      "octopus",
      "bacon bits",
      "dried fruit (raisins, cranberries, apricots)",
      "almonds",
      "cashews",
      "pecans",
      "walnuts",
      "pistachios",
      "sunflower seeds",
      "pumpkin seeds",
      "chia seeds",
      "flaxseeds",
      "sesame seeds",
      "poppy seeds",
      "hemp seeds",
      "granola",
      "breakfast cereal",
      "grits",
      "polenta",
      "crackers",
      "tortillas",
      "naan",
      "pita bread",
      "bagels",
      "english muffins",
      "croissants",
      "pretzels",
      "baguette",
      "buns",
      "wraps",
      "pizza dough",
      "pie crust",
      "phyllo dough",
      "puff pastry",
      "shortbread",
      "biscuits",
      "muffins",
      "scones",
      "doughnuts",
      "pancakes",
      "waffles",
      "french toast",
      "crepes",
      "brown sugar",
      "powdered sugar",
      "vanilla extract",
      "almond extract",
      "cocoa powder",
      "chocolate chips",
      "dark chocolate",
      "white chocolate",
      "milk chocolate",
      "caramel",
      "marshmallows",
      "gelatin",
      "pudding mix",
      "jello mix",
      "whipped cream",
      "frosting",
      "ice cream",
      "sorbet",
      "gelato",
      "custard",
      "macaroni",
      "ravioli",
      "tortellini",
      "fettuccine",
      "spaghetti",
      "penne",
      "rigatoni",
      "lasagna noodles",
      "ramen",
      "udon",
      "soba",
      "rice noodles",
      "egg noodles",
      "potato chips",
      "tortilla chips",
      "popcorn",
      "crackers",
      "pretzels",
      "cornbread",
      "breadsticks",
      "canned tomatoes",
      "tomato paste",
      "tomato sauce",
      "marinara sauce",
      "alfredo sauce",
      "soy sauce",
      "tamari",
      "fish sauce",
      "hoisin sauce",
      "oyster sauce",
      "teriyaki sauce",
      "chili sauce",
      "sriracha",
      "ketchup",
      "mustard",
      "mayonnaise",
      "hot sauce",
      "bbq sauce",
      "honey mustard",
      "relish",
      "salsa",
      "guacamole",
      "hummus",
      "pesto",
      "tapenade",
      "capers",
      "olives (black, green)",
      "pickles",
      "jalapeños",
      "sauerkraut",
      "kimchi",
      "canned beans",
      "canned corn",
      "canned peas",
      "canned tuna",
      "canned salmon",
      "canned chicken",
      "canned clams",
      "canned shrimp",
      "canned mushrooms",
      "artichoke hearts",
      "water chestnuts",
      "bamboo shoots",
      "canned pineapple",
      "coconut milk",
      "coconut cream",
      "curry paste",
      "red curry paste",
      "green curry paste",
      "yellow curry paste",
      "coconut flakes",
      "shredded coconut",
      "chocolate syrup",
      "maple syrup",
      "agave nectar",
      "molasses",
      "corn syrup",
      "granola bars",
      "protein bars",
      "trail mix",
      "dried apricots",
      "dried cranberries",
      "dried mango",
      "dried pineapple",
      "freeze-dried fruit",
      "instant potatoes",
      "couscous",
      "polenta",
      "quinoa",
      "barley",
      "rice (basmati, jasmine)",
      "wild rice",
      "risotto",
      "cornmeal",
      "tapioca",
      "arborio rice",
      "gnocchi",
      "lentils",
      "split peas",
      "mung beans",
      "black-eyed peas",
      "edamame",
      "cannellini beans",
      "navy beans",
      "adzuki beans",
      "pinto beans",
      "kidney beans",
      "white beans",
      "black beans",
      "soybeans",
      "chickpeas",
      "fava beans",
      "butter beans",
      "tempeh",
      "seitan",
      "tofu",
      "paneer",
      "parmesan",
      "mozzarella",
      "cheddar",
      "swiss cheese",
      "brie",
      "gouda",
      "blue cheese",
      "cream cheese",
      "feta cheese",
      "goat cheese",
      "provolone",
      "ricotta",
      "cottage cheese",
      "mascarpone",
      "sour cream",
      "heavy cream",
      "whipping cream",
      "half-and-half",
      "evaporated milk",
      "condensed milk",
      "buttermilk",
      "almond milk",
      "soy milk",
      "oat milk",
      "coconut milk",
      "rice milk",
      "peanut butter",
      "almond butter",
      "cashew butter",
      "tahini",
      "hazelnuts",
      "macadamia nuts",
      "pecans",
      "pine nuts",
      "pistachios",
      "walnuts",
      "sunflower seeds",
      "pumpkin seeds",
      "flaxseeds",
      "chia seeds",
      "sesame seeds",
      "poppy seeds",
      "hemp seeds",
      "basil pesto",
      "tapenade",
      "olive tapenade",
      "sun-dried tomatoes",
      "artichoke hearts",
      "avocados",
      "bananas",
      "blueberries",
      "blackberries",
      "strawberries",
      "raspberries",
      "cherries",
      "mango",
      "pineapple",
      "papaya",
      "kiwi",
      "pomegranate",
      "figs",
      "dates",
      "coconut",
      "melons",
      "cantaloupe",
      "honeydew",
      "watermelon",
      "grapefruit",
      "grapes",
      "lemons",
      "limes",
      "oranges",
      "clementines",
      "mandarins",
      "tangerines",
      "peaches",
      "nectarines",
      "plums",
      "apricots",
      "persimmons",
      "starfruit",
      "passionfruit",
      "guava",
      "dragon fruit",
      "jackfruit",
      "lychee",
      "durian",
      "rhubarb",
      "plantains",
      "soursop",
      "breadfruit",
      "rose apple",
      "sapote",
      "mangosteen",
      "turmeric",
      "mace",
      "mustard seeds",
      "fenugreek",
      "saffron",
      "garam masala",
      "herbes de provence",
      "za'atar",
      "baharat",
      "ras el hanout",
      "dukkah",
      "chili powder",
      "curry powder",
    ];

    // APIKeys
    this.imgurAPIKey = config.imgurAPIKey;
    this.imgurAlbumID = config.imgurAlbumID;
    this.imgurAccessToken = config.imgurAccessToken;
    this.googleAPIKey = config.googleAPIKey;
    this.spoonacularAPIKey = config.spoonacularAPIKey;

    // binding class methods

    this.updateState = this.updateState.bind(this);
    this.getState = this.getState.bind(this);
  }

  updateState(key, value) {
    if (this.hasOwnProperty(key)) {
      this[key] = value;
    } else {
      console.warn(`State key "${key}" does not exist`);
    }
  }

  getState(key) {
    return this[key];
  }
}

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
    this.restrictionsCheckboxes = document.getElementsByClassName(
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

class DOMManager {
  constructor() {
    this.app = new AppDOMManager();
    this.form = new FormDOMManager();
    this.recipes = new RecipesHandlerDOMManager();
  }
}

class App {
  constructor(
    form,
    imageTitleHandler,
    recipesHandler,
    domManager,
    favoriteRecipesContainer,
    appStateManager
  ) {
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    this.form = form;
    this.domManager = domManager;
    this.imageTitleHandler = imageTitleHandler;
    this.recipesHandler = recipesHandler;
    this.appStateManager = appStateManager;
    this.dietInfo = this.dietInfo.bind(this);
    this.postImage = this.postImage.bind(this);
    this.handlePostImageSuccess = this.handlePostImageSuccess.bind(this);
    this.handlePostImageError = this.handlePostImageError.bind(this);
    this.imageRecognition = this.imageRecognition.bind(this);
    this.handleImageRecognitionSuccess =
      this.handleImageRecognitionSuccess.bind(this);
    this.handleImageRecognitionError =
      this.handleImageRecognitionError.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.handleGetRecipesSuccess = this.handleGetRecipesSuccess.bind(this);
    this.handleGetRecipesError = this.handleGetRecipesError.bind(this);
    this.getFavoriteRecipes = this.getFavoriteRecipes.bind(this);
    this.handleGetFavoriteRecipesSuccess =
      this.handleGetFavoriteRecipesSuccess.bind(this);
    this.handleGetFavoriteRecipesError =
      this.handleGetFavoriteRecipesError.bind(this);
    this.savedDietInfoCheck = this.savedDietInfoCheck.bind(this);
    this.localStorageCheck = this.localStorageCheck.bind(this);
    this.getRandomRecipes = this.getRandomRecipes.bind(this);
    this.handleGetRandomRecipesSuccess =
      this.handleGetRandomRecipesSuccess.bind(this);
  }

  start() {
    this.localStorageCheck();
    this.savedDietInfoCheck();
    this.getRandomRecipes();
    this.form.clickDietInfo(this.dietInfo);
    this.form.clickPostImage(this.postImage);
    this.form.clickGetRecipes(this.getRecipes);
    this.form.clickGetRandomRecipes(this.getRandomRecipes);
    this.form.clickGetFavoriteRecipes(this.getFavoriteRecipes);
    this.recipesHandler.clickGetFavoriteRecipes(this.getFavoriteRecipes);
  }

  localStorageCheck() {
    if (!localStorage.getItem("favoriteArray")) {
      this.appStateManager.updateState("favoriteArray", []);
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
    } else {
      this.appStateManager.updateState(
        "favoriteArray",
        JSON.parse(localStorage.getItem("favoriteArray"))
      );
    }
    if (!localStorage.getItem("restrictionsString")) {
      this.appStateManager.updateState("restrictionsString", "");
    } else {
      this.appStateManager.updateState(
        "restrictionsString",
        JSON.parse(localStorage.getItem("restrictionsString"))
      );
    }
    if (!localStorage.getItem("intolerancesString")) {
      this.appStateManager.updateState("intolerancesString", "");
    } else {
      this.appStateManager.updateState(
        "intolerancesString",
        JSON.parse(localStorage.getItem("intolerancesString"))
      );
    }
  }

  savedDietInfoCheck() {
    if (
      !localStorage.getItem("restrictionsString") ||
      !localStorage.getItem("intolerancesString")
    ) {
      return;
    }
    let restrictionsArray = JSON.parse(
      localStorage.getItem("restrictionsString")
    ).split(",");
    let intolerancesArray = JSON.parse(
      localStorage.getItem("intolerancesString")
    ).split(",");
    for (
      let i = 0;
      i < this.domManager.app.restrictionsCheckboxes.length;
      i++
    ) {
      if (
        restrictionsArray.includes(
          this.domManager.app.restrictionsCheckboxes[i].id
        )
      ) {
        this.domManager.app.restrictionsCheckboxes[i].checked = true;
      }
    }
    for (
      let j = 0;
      j < this.domManager.app.intolerancesCheckboxes.length;
      j++
    ) {
      if (
        intolerancesArray.includes(
          this.domManager.app.intolerancesCheckboxes[j].id
        )
      ) {
        this.domManager.app.intolerancesCheckboxes[j].checked = true;
      }
    }
  }

  dietInfo() {
    let restrictionValues = "";
    let intoleranceValues = "";
    for (
      let i = 0;
      i < this.domManager.app.restrictionsCheckboxes.length;
      i++
    ) {
      if (this.domManager.app.restrictionsCheckboxes[i].checked) {
        restrictionValues +=
          this.domManager.app.restrictionsCheckboxes[i].value + ", ";
      }
    }
    for (
      let j = 0;
      j < this.domManager.app.intolerancesCheckboxes.length;
      j++
    ) {
      if (this.domManager.app.intolerancesCheckboxes[j].checked) {
        intoleranceValues +=
          this.domManager.app.intolerancesCheckboxes[j].value + ", ";
      }
    }
    this.domManager.app.spoonacularDataToSend.diet = restrictionValues
      .slice(0, -2)
      .replace(/\s/g, "");
    this.appStateManager.updateState(
      "restrictionsString",
      this.domManager.app.spoonacularDataToSend.diet
    );
    localStorage.setItem(
      "restrictionsString",
      JSON.stringify(this.appStateManager.getState("restrictionsString"))
    );
    this.domManager.app.spoonacularDataToSend.intolerances = intoleranceValues
      .slice(0, -2)
      .replace(/\s/g, "");
    this.appStateManager.updateState(
      "intolerancesString",
      this.domManager.app.spoonacularDataToSend.intolerances
    );
    localStorage.setItem(
      "intolerancesString",
      JSON.stringify(this.appStateManager.getState("intolerancesString"))
    );
  }

  //POST request to IMGUR with image id supplied
  postImage(formData, domManager) {
    $.ajax({
      method: "POST",
      url: "https://api.imgur.com/3/image/",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      headers: {
        Authorization: `Bearer ${this.appStateManager.getState("imgurAccessToken")}`,
      },
      xhr: function () {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          (evt) => {
            if (evt.lengthComputable) {
              let percentComplete = evt.loaded / evt.total;
              $("#percentage_bar_upload").css({
                width: percentComplete * 100 + "%",
              });
              if (percentComplete > 0 && percentComplete < 1) {
                $("#percentage_upload_container").removeClass("d-none");
              }
              if (percentComplete === 1) {
                $("#percentage_upload_container").addClass("d-none");
                domManager.app.imageProcessingContainer.classList =
                  "d-flex col-12 flex-column align-items-center justify-content-center desktop-space-form";
              }
            }
          },
          false
        );
        return xhr;
      },
      success: this.handlePostImageSuccess,
      error: this.handlePostImageError,
    });
  }

  handlePostImageSuccess(data) {
    const imageURL = data.data.link;
    this.domManager.app.dataForImageRecognition.requests[0].image.source.imageUri =
      imageURL;
    this.imageTitleHandler.postedImageDownloadProgress(imageURL);
    this.imageRecognition();
  }

  handlePostImageError(error) {
    console.log("error", error);
    this.domManager.app.imgurAPIError.classList = "text-center mt-3";
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = false;
      this.domManager.app.inputs[i].classList.remove("no-click");
    }
  }

  //POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
  imageRecognition() {
    this.domManager.app.imageRecognitionStatusText.classList = "text-center";
    $.ajax({
      url: `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${this.appStateManager.getState("googleAPIKey")}`,
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",
      data: JSON.stringify(this.domManager.app.dataForImageRecognition),
      success: this.handleImageRecognitionSuccess,
      error: this.handleImageRecognitionError,
    });
  }

  handleImageRecognitionSuccess(response) {
    if (!response.responses[0].labelAnnotations) {
      this.domManager.app.imageRecognitionStatusText.classList = "d-none";
      this.domManager.app.imageRecognitionFailedText.classList = "text-center";
      this.domManager.app.uploadedImage.src = "";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    const imageTitle = response.responses[0].labelAnnotations[0].description;
    const score = response.responses[0].labelAnnotations[0].score;
    this.imageTitleHandler.imageTitleOnPage(imageTitle, score);
    this.domManager.app.imageRecognitionStatusText.classList =
      "text-center d-none";
    this.getRecipes(imageTitle);
  }

  handleImageRecognitionError(error) {
    console.error(error);
  }

  //GET request to Spoonacular's API with label from Google, if available, to get a list of up to 100 recipes.

  getRandomRecipes() {
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = true;
      this.domManager.app.inputs[i].classList.add("no-click");
    }
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-visible text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList =
      "text-center mt-3";
    this.domManager.app.searchRecipesDownloadText.textContent =
      "Gathering random recipes, please wait...";
    this.domManager.app.titleContainer.classList = "d-none desktop-space-form";
    this.domManager.app.percentageBarContainer.classList =
      "d-none desktop-space-form";
    this.domManager.app.uploadedImageContainer.classList =
      "d-none desktop-space-form";
    this.appStateManager.updateState("chunkedRecipeArray", []);
    this.appStateManager.updateState("chunkedRecipeArrayIndex", 0);
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${this.appStateManager.getState("spoonacularAPIKey")}&addRecipeNutrition=true&636x393&number=100&sort=random`;
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: this.domManager.app.spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
      success: this.handleGetRandomRecipesSuccess,
      error: this.handleGetRecipesError,
    });
  }

  handleGetRandomRecipesSuccess(recipes) {
    this.recipesHandler.chunkRandomRecipes(recipes);
  }

  getRecipes(imageTitle) {
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-visible text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList =
      "text-center mt-3";
    this.domManager.app.searchRecipesDownloadText.textContent =
      "Gathering recipes, please wait...";
    this.appStateManager.updateState("chunkedRecipeArray", []);
    this.appStateManager.updateState("chunkedRecipeArrayIndex", 0);
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${imageTitle}&apiKey=${this.appStateManager.getState("spoonacularAPIKey")}&addRecipeNutrition=true&636x393&number=100`;
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: this.domManager.app.spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
      error: this.handleGetRecipesError,
      success: this.handleGetRecipesSuccess,
      timeout: 10000,
    });
  }

  handleGetRecipesSuccess(recipes) {
    this.recipesHandler.chunkSearchedRecipes(recipes);
  }

  handleGetRecipesError(error) {
    this.domManager.app.searchRecipesDownloadContainer.classList = "d-none";
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-hidden text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList = "d-none";
    this.domManager.app.spoonacularSearchError.classList = "text-center mt-3";
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = false;
      this.domManager.app.inputs[i].classList.remove("no-click");
    }
    if (error.status === 402) {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "The Spoonacular API has reached its daily quota for this app's current API Key. Please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a>, thank you.";
      return;
    }
    if (error.statusText === "timeout") {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "The ajax request to the Spoonacular API has timed out, please try again.";
      return;
    } else {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "There is a CORS issue with the Spoonacular's API.  This issue will usually resolve itself in ten minutes.  If it does not, please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a >, thank you.";
    }
  }

  getFavoriteRecipes() {
    while (this.favoriteRecipesContainer.firstChild) {
      this.favoriteRecipesContainer.removeChild(
        this.favoriteRecipesContainer.firstChild
      );
    }
    if (
      !localStorage.getItem("favoriteArray") ||
      localStorage.getItem("favoriteArray") === "[]"
    ) {
      this.domManager.app.emptyFavoriteTextContainer.classList =
        "d-flex justify-content-center";
      return;
    }
    this.domManager.app.favoriteRecipesSection.classList =
      "favorite-recipes-visible d-flex flex-column justify-content-center";
    this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-visible mt-3";
    this.domManager.app.favoriteRecipesStatusText.classList = "text-center";
    this.appStateManager.updateState(
      "favoriteArray",
      JSON.parse(localStorage.getItem("favoriteArray"))
    );
    let stringifiedArray = this.appStateManager
      .getState("favoriteArray")
      .join(",");
    let spoonacularURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${stringifiedArray}&apiKey=${this.appStateManager.getState("spoonacularAPIKey")}&includeNutrition=true&size=636x393`;
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      error: this.handleGetFavoriteRecipesError,
      success: this.handleGetFavoriteRecipesSuccess,
    });
  }

  handleGetFavoriteRecipesSuccess(recipes) {
    this.recipesHandler.displayFavoriteRecipes(recipes);
  }

  handleGetFavoriteRecipesError(error) {
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-hidden";
    this.domManager.app.favoriteRecipesStatusText.classList = "d-none";
    if (error.statusText === "error") {
      this.domManager.app.spoonacularFavoriteError.classList =
        "mt-3 text-center";
    }
    if (error.statusText === "timeout") {
      this.domManager.app.spoonacularFavoriteTimeoutError.classList =
        "mt-3 text-center";
    }
  }
}

// --------- app.js end

// --------- image-title-handler.js start

class ImageTitleHandler {
  constructor(domManager) {
    this.domManager = domManager;
  }

  postedImageDownloadProgress(imageURL) {
    this.domManager.app.imageProcessingContainer.classList =
      "d-none desktop-space-form";
    let imageURLParameter = imageURL;
    let imageLoader = {};
    imageLoader["LoadImage"] = (imageURLParameter, progressUpdateCallback) => {
      return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", imageURL, true);
        xhr.responseType = "arraybuffer";
        xhr.onprogress = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            let percentComplete = progressEvent.loaded / progressEvent.total;
            $("#percentage_bar_download").css({
              width: percentComplete * 100 + "%",
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $("#percentage_download_container").removeClass("d-none");
            }
            if (percentComplete === 1) {
              $("#percentage_download_container").addClass("d-none");
              this.domManager.app.percentageBarContainer.classList =
                "d-none desktop-space-form";
            }
          }
        };
        xhr.onloadend = () => {
          const options = {};
          const headers = xhr.getAllResponseHeaders();
          const typeMatch = headers.match(/^Content-Type:\s*(.*?)$/im);

          if (typeMatch && typeMatch[1]) {
            options.type = typeMatch[1];
          }

          const blob = new Blob([this.response], options);
          resolve(window.URL.createObjectURL(blob));
        };
        xhr.send();
      });
    };
    this.imageLoaderFunction(imageLoader, imageURLParameter);
  }

  imageLoaderFunction(imageLoader, imageURL) {
    imageLoader.LoadImage("imageURL").then((image) => {
      this.domManager.app.uploadedImage.src = imageURL;
    });
  }

  imageTitleOnPage(imageTitle, score) {
    const h2 = document.createElement("h1");
    h2.id = "image_title";
    h2.classList = "text-center";
    h2.textContent = imageTitle;
    this.domManager.app.titleContainer.append(h2);
    const p = document.createElement("p");
    p.id = "title_score";
    p.classList = "text-center";
    const percent = (score * 100).toFixed(2);
    p.textContent = `Confidence: ${percent}%`;
    this.domManager.app.titleContainer.append(p);
    const hr = document.createElement("hr");
    hr.id = "hr";
    hr.classList = "mx-3 my-0 py-0 d-xl-none";
    this.domManager.app.titleContainer.append(hr);
  }
}

// --------- image-title-handler.js end

// --------- form.js start

class Form {
  constructor(domManager, appStateManager) {
    this.domManager = domManager;
    this.domManager.app.favoriteRecipesSection.addEventListener(
      "scroll",
      this.keepUserInputContainerPosition.bind(this)
    );
    this.domManager.form.openSideMenuButton.addEventListener(
      "click",
      this.openSideMenu.bind(this)
    );
    this.domManager.form.closeSideMenuButton.addEventListener(
      "click",
      this.closeSideMenu.bind(this)
    );
    this.domManager.form.toggleFavoritesButton.addEventListener(
      "click",
      this.toggleFavorites.bind(this)
    );
    this.domManager.form.toggleDietButton.addEventListener(
      "click",
      this.toggleDiet.bind(this)
    );
    this.domManager.form.searchButton.addEventListener(
      "click",
      this.search.bind(this)
    );
    this.domManager.form.fileInputForm.addEventListener(
      "change",
      this.imgValidation.bind(this)
    );
    this.appStateManager = appStateManager;
    overlay.addEventListener("click", this.closeSideMenu.bind(this));
    this.domManager.form.recipeSearchInput.addEventListener(
      "keyup",
      this.enterSearch.bind(this)
    );
    this.domManager.form.fileLabel.addEventListener(
      "dragover",
      this.imgValidation.bind(this)
    );
    document.addEventListener("drop", function (event) {
      if (event.target.id !== "file_input_form") {
        event.preventDefault();
      }
    });
  }

  clickDietInfo(dietInfo) {
    this.dietInfo = dietInfo;
  }

  clickPostImage(postImage) {
    this.postImage = postImage;
  }

  clickGetRecipes(getRecipes) {
    this.getRecipes = getRecipes;
  }

  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  clickGetRandomRecipes(getRandomRecipes) {
    this.getRandomRecipes = getRandomRecipes;
  }

  enterSearch() {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search(event);
    }
  }

  toggleFavorites() {
    event.preventDefault();
    this.domManager.app.favoriteRecipesSection.classList =
      "d-flex flex-column justify-content-center";
    this.domManager.app.dietMenu.classList =
      "d-none flex-column justify-content-center align-items-center";
    this.domManager.form.toggleFavoritesButton.classList.add(
      "font-weight-bold"
    );
    this.domManager.form.toggleDietButton.classList.remove("font-weight-bold");
  }

  toggleDiet() {
    event.preventDefault();
    this.domManager.app.favoriteRecipesSection.classList =
      "d-none flex-column justify-content-center";
    this.domManager.app.dietMenu.classList =
      "d-flex flex-column justify-content-center align-items-center";
    this.domManager.form.toggleFavoritesButton.classList.remove(
      "font-weight-bold"
    );
    this.domManager.form.toggleDietButton.classList.add("font-weight-bold");
  }

  openFavorites() {
    event.preventDefault();
    this.appStateManager.updateState("favoriteYPosition", window.scrollY);
    this.domManager.app.favoriteRecipesSection.classList =
      "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (
      !localStorage.getItem("favoriteArray") ||
      localStorage.getItem("favoriteArray") !== "[]"
    ) {
      this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
    }
    this.domManager.form.mainContent.classList =
      "row main-content-right noscroll";
    this.domManager.form.mainContent.style.top = `-${this.appStateManager.getState("favoriteYPosition")}px`;
    this.domManager.app.formElement.style.top = "0px";
    this.domManager.app.formElement.classList =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    overlay.classList = "";
    this.getFavoriteRecipes();
  }

  closeFavorites() {
    event.preventDefault();
    this.domManager.app.favoriteRecipesSection.classList =
      "favorite-recipes-hidden d-flex flex-column justify-content-center";
    this.domManager.form.mainContent.classList = "row";
    overlay.classList = "d-none";
    window.scroll(0, this.appStateManager.getState("favoriteYPosition"));
    this.domManager.app.formElement.classList =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "recipe-progress-hidden mt-3 text-center";
    this.domManager.app.spoonacularFavoriteError.classList = "d-none";
    this.domManager.app.spoonacularFavoriteTimeoutError.classList = "d-none";
  }

  openSideMenu() {
    event.preventDefault();
    this.appStateManager.updateState("favoriteYPosition", window.scrollY);
    this.appStateManager.updateState(
      "rect",
      this.domManager.form.userInputContainer.getBoundingClientRect()
    );
    this.domManager.form.closeSideMenuButton.classList =
      "close-side-menu-button-visible d-flex justify-content-center align-items-center text-danger p-0 m-0";
    this.domManager.form.toggleFavoritesButton.classList =
      "favorites-toggle-visible toggle btn btn-danger text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center font-weight-bold";
    this.domManager.form.favoriteStickyDiv.classList =
      "favorite-sticky-div-visible m-0 p-0";
    this.domManager.form.toggleDietButton.classList =
      "diet-toggle-visible toggle btn btn-primary text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center";
    this.domManager.form.sideMenuContainer.classList =
      "side-menu-visible d-flex flex-column justify-content-center align-items-center";
    this.domManager.app.favoriteRecipesSection.classList =
      "d-flex flex-column justify-content-center";
    this.domManager.app.dietMenu.classList =
      "d-none flex-column justify-content-center align-items-center";
    this.domManager.form.mainContent.classList =
      "row main-content-right noscroll";
    overlay.classList = "";
    this.domManager.form.mainContent.style.top = `-${this.appStateManager.getState("favoriteYPosition")}px`;
    this.domManager.form.headerElement.classList =
      "d-flex flex-column align-items-center justify-content-center my-2 px-0";
    this.domManager.app.formElement.style.top = "0px";
    this.domManager.app.formElement.classList =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    this.domManager.form.userInputContainer.classList =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    this.domManager.form.mainContent.style.top = `-${this.appStateManager.getState("favoriteYPosition")}px - 50px`;
    this.getFavoriteRecipes();
  }

  keepUserInputContainerPosition() {
    if (
      document
        .getElementById("side_menu_container")
        .classList.contains("side-menu-visible") &&
      document.getElementById("diet_menu").classList.contains("d-none")
    ) {
      this.domManager.form.userInputContainer.scrollY =
        this.appStateManager.getState("rect").top;
    } else return;
  }

  closeSideMenu() {
    event.preventDefault();
    this.domManager.form.closeSideMenuButton.classList =
      "close-side-menu-button-hidden d-flex justify-content-center align-items-center text-danger p-0 m-0";
    this.domManager.form.toggleFavoritesButton.classList =
      "favorites-toggle-hidden toggle btn btn-danger text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center";
    this.domManager.form.toggleDietButton.classList =
      "diet-toggle-hidden toggle btn btn-primary text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center";
    this.domManager.form.favoriteStickyDiv.classList =
      "favorite-sticky-div-hidden m-0 p-0";
    this.domManager.form.sideMenuContainer.classList =
      "side-menu-hidden d-flex flex-column justify-content-center align-items-center";
    this.domManager.form.mainContent.classList = "row";
    overlay.classList = "d-none";
    window.scroll(0, this.appStateManager.getStates(favoriteYPosition));
    this.domManager.app.formElement.classList =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    this.domManager.form.headerElement.classList =
      "static d-flex flex-column align-items-center justify-content-center my-2 px-0";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-hidden mt-3 text-center";
    this.domManager.app.spoonacularFavoriteError.classList = "d-none";
    this.domManager.app.spoonacularFavoriteTimeoutError.classList = "d-none";
    this.domManager.form.userInputContainer.classList =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    this.dietInfo();
  }

  imgValidation(event) {
    event.preventDefault();
    if (!this.domManager.form.fileInputForm.files[0]) {
      return;
    }
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = true;
      this.domManager.app.inputs[i].classList.add("no-click");
    }
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    if (document.getElementById("image_title")) {
      document.getElementById("image_title").remove();
    }
    if (document.getElementById("title_score")) {
      document.getElementById("title_score").remove();
    }
    if (document.getElementById("hr")) {
      document.getElementById("hr").remove();
    }
    this.domManager.app.percentageBarContainer.classList =
      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
    this.domManager.app.uploadedImage.src = "";
    this.domManager.app.searchResultsQuantityDiv.classList = "d-none";
    this.domManager.app.resultsShownQuantityDiv.classList = "d-none";
    this.domManager.app.imageRecognitionFailedText.classList = "d-none";
    this.domManager.form.errorContainer.classList = "d-none desktop-space-form";
    this.domManager.form.errorNoFile.classList = "d-none";
    this.domManager.form.errorIncorrectFile.classList = "d-none";
    this.domManager.form.errorFileExceedsSize.classList = "d-none";
    this.domManager.form.errorSpoonacularSearch.classList = "d-none";
    this.domManager.form.errorNoSearchResults.classList = "d-none";
    this.domManager.form.errorImgurCORSIssue.classList = "d-none";
    this.domManager.form.errorNoSearchResults.classList = "d-none";
    this.domManager.app.titleContainer.classList =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-around flex-column desktop-space-form mb-3";
    this.domManager.app.percentageBarContainer.classList =
      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
    this.domManager.app.uploadedImageContainer.classList =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center my-3 desktop-space-form";
    if (this.domManager.form.fileInputForm.files[1]) {
      this.domManager.form.fileInputForm.files.splice(1, 1);
    }
    const imageFile = this.domManager.form.fileInputForm.files[0];
    if (!imageFile) {
      this.domManager.form.errorContainer.classList =
        "col-12 mt-2 desktop-space-form";
      this.domManager.form.errorNoFile.classList = "text-danger text-center";
      this.domManager.form.fileInputForm.value = "";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!mimeTypes.includes(fileType)) {
      this.domManager.form.errorContainer.classList =
        "col-12 mt-2 desktop-space-form";
      this.domManager.form.errorIncorrectFile.classList =
        "text-danger text-center";
      this.domManager.form.fileInputForm.value = "";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    if (imageFile.size > 10485760) {
      this.domManager.form.errorContainer.classList =
        "col-12 mt-2 desktop-space-form";
      this.domManager.form.errorFileExceedsSize.classList =
        "text-danger text-center";
      this.domManager.form.fileInputForm.value = "";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    this.dietInto();
    formData.append("image", imageFile);
    formData.append("album", this.appStateManager.getState("imgurAlbumID"));
    this.postImage(formData, this.domManager);
    this.domManager.form.fileInputForm.value = "";
  }

  search(event) {
    event.preventDefault();
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    this.domManager.app.searchResultsQuantityDiv.classList = "d-none";
    this.domManager.app.resultsShownQuantityDiv.classList = "d-none";
    this.domManager.app.imageRecognitionFailedText.classList = "d-none";
    this.domManager.form.errorContainer.classList = "d-none desktop-space-form";
    this.domManager.form.errorNoFile.classList = "d-none";
    this.domManager.form.errorIncorrectFile.classList = "d-none";
    this.domManager.form.errorFileExceedsSize.classList = "d-none";
    this.domManager.form.errorSpoonacularSearch.classList = "d-none";
    this.domManager.form.errorNoSearchResults.classList = "d-none";
    this.domManager.form.errorImgurCORSIssue.classList = "d-none";
    this.domManager.form.errorNoSearchResults.classList = "d-none";
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = true;
      this.domManager.app.inputs[i].classList.add("no-click");
    }
    let query = this.domManager.form.recipeSearchInput.value;
    this.dietInfo();
    this.domManager.app.titleContainer.classList = "d-none desktop-space-form";
    this.domManager.app.percentageBarContainer.classList =
      "d-none desktop-space-form";
    this.domManager.app.uploadedImageContainer.classList =
      "d-none desktop-space-form";
    if (!query) {
      this.getRandomRecipes();
      return;
    }
    this.getRecipes(query);
  }
}

// ---------- form.js end

// ----------- recipes-handler.js start

class RecipesHandler {
  constructor(
    searchRecipesContainer,
    favoriteRecipesContainer,
    domManager,
    appStateManager
  ) {
    this.appStateManager = appStateManager;
    this.domManager = domManager;
    this.searchRecipesContainer = searchRecipesContainer;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    window.addEventListener("scroll", this.handleShowMoreScroll.bind(this));
    this.domManager.recipes.backToTopButton.addEventListener(
      "click",
      this.handleBackToTopClick
    );
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown =
      this.updateResultsQuantityShown.bind(this);
    this.favoriteCheck = this.favoriteCheck.bind(this);
    this.domManager.recipes.modalContainer.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
    this.domManager.app.closePreviewXButton.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
  }
  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkSearchedRecipes(recipes) {
    this.domManager.app.recipeInformation = recipes;
    if (!recipes.results[0]) {
      this.domManager.app.searchRecipesDownloadProgress.classList =
        "recipe-progress-hidden mt-3";
      this.domManager.app.searchRecipesDownloadText.classList = "d-none";
      this.domManager.app.noSearchRecipesText.classList = "text-center mt-3";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    this.domManager.app.searchResultsQuantityDiv.classList =
      "d-flex justify-content-center mt-3";
    this.domManager.recipes.searchResultsQuantityText.textContent = `${recipes.results.length} recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      const tempRecipeArray =
        this.appStateManager.getState("chunkedRecipeArray");
      tempRecipeArray.push(recipes.results.slice(a, a + 12));
      this.appStateManager.updateState("chunkedRecipeArray", tempRecipeArray);
      a = a + 12;
    }
    this.displaySearchedRecipes(
      this.appStateManager.getState("chunkedRecipeArray"),
      this.appStateManager.getState("chunkedRecipeArrayIndex")
    );
    if (recipes.results.length > 12) {
      this.domManager.app.resultsShownQuantityDiv.classList =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  chunkRandomRecipes(recipes) {
    this.domManager.app.recipeInformation = recipes;
    if (!recipes.results[0]) {
      this.domManager.app.searchRecipesDownloadProgress.classList =
        "recipe-progress-hidden mt-3";
      this.domManager.app.searchRecipesDownloadText.classList = "d-none";
      this.domManager.app.noSearchRecipesText.classList = "text-center mt-3";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    this.domManager.app.searchResultsQuantityDiv.classList =
      "d-flex justify-content-center mt-3";
    this.domManager.recipes.searchResultsQuantityText.textContent = `${recipes.results.length} random recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      const tempRecipeArray =
        this.appStateManager.getState("chunkedRecipeArray");
      tempRecipeArray.push(recipes.results.slice(a, a + 12));
      this.appStateManager.updateState("chunkedRecipeArray", tempRecipeArray);
      a = a + 12;
    }
    this.displaySearchedRecipes(
      this.appStateManager.getState("chunkedRecipeArray"),
      this.appStateManager.getState("chunkedRecipeArrayIndex")
    );
    if (recipes.results.length > 12) {
      this.domManager.app.resultsShownQuantityDiv.classList =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  handleShowMoreScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      if (
        this.appStateManager.getState("chunkedRecipeArrayIndex") !==
        this.appStateManager.getState("chunkedRecipeArray").length - 1
      ) {
        let yPosition = window.scrollY;
        this.appStateManager.updateState(
          "chunkedRecipeArrayIndex",
          this.appStateManager.getState("chunkedRecipeArrayIndex") + 1
        );
        this.displaySearchedRecipes(
          this.appStateManager.getState("chunkedRecipeArray"),
          this.appStateManager.getState("chunkedRecipeArrayIndex")
        );
        window.scroll(0, yPosition);
        this.updateResultsQuantityShown();
      }
    }
  }

  handleBackToTopClick() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  updateResultsQuantityShown() {
    this.domManager.recipes.resultsShownQuantityText.textContent = `Showing ${
      document.querySelectorAll(".recipe-card").length
    } of ${this.domManager.recipes.searchResultsQuantityText.textContent.substring(0, 3)}`;
  }

  handleFavoriteClick(id) {
    event.stopPropagation();
    let heartIcon = document.getElementById(`heart_icon_${id}`);
    let recipeTitle =
      heartIcon.parentNode.parentNode.parentNode.lastChild.firstChild.firstChild
        .firstChild.textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    if (!this.appStateManager.getState("favoriteArray").includes(id)) {
      this.appStateManager.updateState("favoriteArray", [
        ...this.appStateManager.getState("favoriteArray"),
        id,
      ]);
      heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.classList =
        "recipe-card favorited card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      // Toastify({
      //   text: `${twoWords}... added`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    } else {
      const tempArray = this.appStateManager.getState("favoriteArray");
      const index = this.appStateManager.getState("favoriteArray").indexOf(id);
      if (index !== -1) {
        tempArray.splice(index, 1);
        this.appStateManager.updateState("favoriteArray", tempArray);
      }
      heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.classList =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      // Toastify({
      //   text: `${twoWords}... removed`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    }
    localStorage.setItem(
      "favoriteArray",
      JSON.stringify(this.appStateManager.getState("favoriteArray"))
    );
  }

  handleDeleteClick(id) {
    event.stopPropagation();
    let deleteCard = document.getElementById(`${id}`);
    let recipeTitle =
      deleteCard.firstChild.nextSibling.firstChild.firstChild.firstChild
        .textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    const tempArray = this.appStateManager.getState("favoriteArray");
    const index = this.appStateManager.getState("favoriteArray").indexOf(id);
    if (index !== -1) {
      tempArray.splice(index, 1);
      this.appStateManager.updateState("favoriteArray", tempArray);
    }
    document.getElementById(`${id}`).remove();
    localStorage.setItem(
      "favoriteArray",
      JSON.stringify(this.appStateManager.getState("favoriteArray"))
    );
    if (localStorage.getItem("favoriteArray") === "[]") {
      this.domManager.app.emptyFavoriteTextContainer.classList =
        "d-flex justify-content-center";
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    if (
      this.domManager.app.favoriteRecipesSection.scrollHeight >
      this.domManager.app.favoriteRecipesSection.clientHeight
    ) {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    // Toastify({
    //   text: `${twoWords}... removed`,
    //   duration: 1500,
    //   newWindow: true,
    //   gravity: "bottom",
    //   position: "left",
    // }).showToast();
    this.favoriteCheck(id);
  }

  handleFavoriteButtonClick(id) {
    event.stopPropagation();
    const favoriteButton = document.getElementById("favorite_button");
    let recipeTitle = document.getElementById("recipe_title").textContent;
    let twoWords = recipeTitle.split(" ").slice(2, 4).join(" ");
    if (!this.appStateManager.getState("favoriteArray").includes(id)) {
      this.appStateManager.updateState("favoriteArray", [
        ...this.appStateManager.getState("favoriteArray"),
        id,
      ]);
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
      // Toastify({
      //   text: `${twoWords}... added`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).classList =
          "fas fa-heart text-danger heart-icon fa-lg";
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      if (
        this.domManager.app.favoriteRecipesSection.classList.contains(
          "favorite-recipes-visible"
        )
      ) {
        this.getFavoriteRecipes();
        this.domManager.app.spoonacularFavoriteError.classList = "d-none";
        this.domManager.app.spoonacularFavoriteTimeoutError.classList =
          "d-none";
      }
      return;
    } else {
      const tempArray = this.appStateManager.getState("favoriteArray");
      const index = this.appStateManager.getState("favoriteArray").indexOf(id);
      if (index !== -1) {
        tempArray.splice(index, 1);
        this.appStateManager.updateState("favoriteArray", tempArray);
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).classList =
          "far fa-heart text-danger heart-icon fa-lg";
      }
      if (document.getElementById(`${id}`)) {
        document.getElementById(`${id}`).remove();
      }
      if (
        this.domManager.app.favoriteRecipesSection.scrollHeight >
          this.domManager.app.favoriteRecipesSection.clientHeight &&
        this.domManager.app.favoriteRecipesSection.classList.contains(
          "favorite-recipes-visible"
        )
      ) {
        this.domManager.app.favoriteRecipesSection.classList =
          "favorite-recipes-visible d-flex flex-column justify-content-start";
      } else {
        this.domManager.app.favoriteRecipesSection.classList =
          "favorite-recipes-visible d-flex flex-column justify-content-center";
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      if (
        !localStorage.getItem("favoriteArray") ||
        localStorage.getItem("favoriteArray") === "[]"
      ) {
        this.domManager.app.emptyFavoriteTextContainer.classList =
          "d-flex justify-content-center";
        return;
      }
      // Toastify({
      //   text: `${twoWords}... removed`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    }
  }

  favoriteCheck() {
    if (!localStorage.getItem("favoriteArray")) {
      return;
    }
    let searchedArray = document.querySelectorAll("#heart_container i");
    let favoriteArrayToCheck = JSON.parse(
      localStorage.getItem("favoriteArray")
    );
    for (let i = 0; i < searchedArray.length; i++) {
      if (
        favoriteArrayToCheck.includes(
          parseInt(searchedArray[i].id.substring(11))
        )
      ) {
        searchedArray[i].classList =
          "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        searchedArray[i].classList =
          "far fa-heart text-danger heart-icon fa-lg";
      }
    }
  }

  modalHandler(
    imageURL,
    title,
    recipeURL,
    id,
    instructions,
    ingredients,
    summary
  ) {
    if (!ingredients) {
      return;
    }
    const recipeBody = document.getElementById("recipe_body");
    const recipeTitle = document.getElementById("recipe_title");
    const recipeImage = document.getElementById("recipe_image");
    const recipeSummary = document.getElementById("recipe_summary");
    const externalLinkButton = document.createElement("button");
    this.domManager.recipes.overlayPreview.classList = "";
    externalLinkButton.id = "external_link_button";
    externalLinkButton.classList = "btn btn-primary text-white";
    externalLinkButton.textContent = "Recipe Page";
    const favoriteButton = document.createElement("button");
    favoriteButton.id = "favorite_button";
    // const closePreviewButton = document.createElement("button");
    // closePreviewButton.id = "go_back_button";
    // closePreviewButton.classList = "btn btn-secondary";
    // closePreviewButton.textContent = "Close Preview";
    this.domManager.app.closePreviewXButton.classList =
      "close-preview-x-button-visible justify-content-center align-items-center text-danger p-0 m-0";
    this.domManager.recipes.modalButtonContainer.append(externalLinkButton);
    this.domManager.recipes.modalButtonContainer.append(favoriteButton);
    // this.domManager.recipes.modalButtonContainer.append(closePreviewButton);
    for (let x = 0; x < ingredients.length; x++) {
      const ingredient = document.createElement("li");
      ingredient.textContent = `${ingredients[x].amount} ${ingredients[x].unit} ${ingredients[x].name}`;
      this.domManager.recipes.recipeIngredients.append(ingredient);
    }
    const cleanSummary = DOMPurify.sanitize(summary);
    this.domManager.recipes.modalContainer.classList = "";
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = cleanSummary;
    this.domManager.recipes.body.classList = "bg-light freeze";
    externalLinkButton.addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });
    favoriteButton.addEventListener(
      "click",
      this.handleFavoriteButtonClick.bind(this, id)
    );
    if (this.appStateManager.getState("favoriteArray").includes(id)) {
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
    } else {
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
    }
    // closePreviewButton.addEventListener("click", this.closePreview.bind(this));
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i] === "var article") {
        return;
      }
      const step = document.createElement("li");
      step.textContent = instructions[i];
      this.domManager.recipes.recipeInstructions.append(step);
    }
  }

  closePreview() {
    // if (event.target === "<i class="fas fa-window-close fa-2x"></i>" || event.target === )
    if (
      event.target.id === "modal_container" ||
      event.target.id === "close_preview_x_icon"
    ) {
      document.querySelector(".modal-body").scrollTo({
        top: 0,
        behavior: "auto",
      });
      this.domManager.recipes.modalContainer.classList =
        "d-none justify-content-center";
      this.domManager.recipes.body.classList = "bg-light";
      this.domManager.recipes.overlayPreview.classList = "d-none";
      while (this.domManager.recipes.recipeInstructions.firstChild) {
        this.domManager.recipes.recipeInstructions.removeChild(
          this.domManager.recipes.recipeInstructions.firstChild
        );
      }
      while (this.domManager.recipes.recipeIngredients.firstChild) {
        this.domManager.recipes.recipeIngredients.removeChild(
          this.domManager.recipes.recipeIngredients.firstChild
        );
      }
      while (this.domManager.recipes.modalButtonContainer.firstChild) {
        this.domManager.recipes.modalButtonContainer.removeChild(
          this.domManager.recipes.modalButtonContainer.firstChild
        );
      }
    } else return;
  }

  displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex) {
    for (
      let i = 0;
      i < chunkedRecipeArray[chunkedRecipeArrayIndex].length;
      i++
    ) {
      const imageURL = `${chunkedRecipeArray[chunkedRecipeArrayIndex][
        i
      ].image.substring(
        0,
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].image.length - 11
      )}480x360.jpg`;
      const title = chunkedRecipeArray[chunkedRecipeArrayIndex][i].title;
      const readyInMinutes =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].readyInMinutes;
      const servings = chunkedRecipeArray[chunkedRecipeArrayIndex][i].servings;
      const recipeURL =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].sourceUrl;
      const caloriesAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[0]
          .amount
      );
      const proteinAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[8]
          .amount
      );
      const fatAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[1]
          .amount
      );
      const carbsAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[3]
          .amount
      );
      const sodiumAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[7]
          .amount
      );
      const id = chunkedRecipeArray[chunkedRecipeArrayIndex][i].id;
      let instructions = [];
      if (
        !chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions
      ) {
        instructions.push("Instructions are available on the Recipe Page.");
      } else {
        for (
          let k = 0;
          k <
          chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions[0]
            .steps.length;
          k++
        ) {
          instructions.push(
            chunkedRecipeArray[chunkedRecipeArrayIndex][i]
              .analyzedInstructions[0].steps[k].step
          );
        }
      }
      const ingredients =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.ingredients;
      const summary = chunkedRecipeArray[chunkedRecipeArrayIndex][i].summary;
      const recipeCard = document.createElement("div");
      recipeCard.classList =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      recipeCard.id = "recipe";
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.classList = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.classList =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.classList = "mb-1 p-0";
      img.width = "240";
      img.height = "180";
      const heartIconContainer = document.createElement("span");
      heartIconContainer.id = "heart_container";
      heartIconContainer.classList =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const heartIcon = document.createElement("i");
      heartIcon.id = `heart_icon_${id}`;
      if (this.appStateManager.getState("favoriteArray").includes(id)) {
        heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
      }
      heartIconContainer.append(heartIcon);
      imageContainer.append(heartIconContainer);
      heartIconContainer.addEventListener(
        "click",
        this.handleFavoriteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.classList = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.classList = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.classList = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.classList = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.classList = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.classList = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.classList = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.classList = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.classList = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.classList = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.classList = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.classList = "card-text d-flex flex-wrap";
      let dietSpan;
      if (chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets) {
        for (
          let j = 0;
          j < chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets.length;
          j++
        ) {
          dietSpan = document.createElement("span");
          dietSpan.classList = "badge badge-light mb-1 mr-1";
          dietSpan.textContent =
            chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets[j];
          cardText3.append(dietSpan);
        }
      }
      cardText2.append(calorieSpan);
      cardText2.append(carbsSpan);
      cardText2.append(fatSpan);
      cardText2.append(proteinSpan);
      cardText2.append(sodiumSpan);
      titleAnchorTag.append(recipeTitle);
      cardTitle.append(titleAnchorTag);
      cardBody.append(cardTitle);
      cardBody.append(cardText1);
      cardBody.append(cardText3);
      cardBody.append(cardText2);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.searchRecipesContainer.append(recipeCard);
      recipeCard.addEventListener(
        "click",
        this.modalHandler.bind(
          this,
          imageURL,
          title,
          recipeURL,
          id,
          instructions,
          ingredients,
          summary
        )
      );
    }
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-hidden mt-3";
    this.domManager.app.searchRecipesDownloadText.classList = "d-none";
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = false;
      this.domManager.app.inputs[i].classList.remove("no-click");
    }
  }

  displayFavoriteRecipes(recipes) {
    for (let i = 0; i < recipes.length; i++) {
      let imageURL = null;
      if ("image" in recipes[i]) {
        imageURL = imageURL = `${recipes[i].image.substring(
          0,
          recipes[i].image.length - 11
        )}556x370.jpg`;
      } else {
        imageURL = "https://spoonacular.com/recipeImages/342447-3480x360.jpg";
      }
      const title = recipes[i].title;
      const readyInMinutes = recipes[i].readyInMinutes;
      const servings = recipes[i].servings;
      const recipeURL = recipes[i].sourceUrl;
      const caloriesAmount = Math.round(
        recipes[i].nutrition.nutrients[0].amount
      );
      const proteinAmount = Math.round(
        recipes[i].nutrition.nutrients[8].amount
      );
      const fatAmount = Math.round(recipes[i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(recipes[i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(recipes[i].nutrition.nutrients[7].amount);
      const id = recipes[i].id;
      let instructions = [];
      if (!recipes[i].analyzedInstructions.length) {
        instructions.push("Instructions are available on the Recipe Page.");
      } else {
        for (
          let k = 0;
          k < recipes[i].analyzedInstructions[0].steps.length;
          k++
        ) {
          instructions.push(recipes[i].analyzedInstructions[0].steps[k].step);
        }
      }
      const ingredients = recipes[i].nutrition.ingredients;
      const summary = recipes[i].summary;
      const recipeCard = document.createElement("div");
      recipeCard.classList =
        "favorite-recipe-card favorited card m-3 px-0 col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2";
      recipeCard.id = id;
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.classList = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.classList =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.classList = "m-0 p-0";
      img.width = "240";
      img.height = "180";
      const deleteIconContainer = document.createElement("span");
      deleteIconContainer.id = "delete_container";
      deleteIconContainer.classList =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const deleteIcon = document.createElement("i");
      deleteIcon.classList = "far fa-trash-alt text-danger delete-icon fa-lg";
      deleteIconContainer.append(deleteIcon);
      imageContainer.append(deleteIconContainer);
      deleteIconContainer.addEventListener(
        "click",
        this.handleDeleteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.classList = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.classList = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.classList = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.classList = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.classList = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.classList = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.classList = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.classList = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.classList = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.classList = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.classList = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.classList = "card=text d-flex flex-wrap";
      if (recipes[i].diets) {
        for (let j = 0; j < recipes[i].diets.length; j++) {
          const dietSpan = document.createElement("span");
          dietSpan.classList = "badge badge-light mb-1 mr-1";
          dietSpan.textContent = recipes[i].diets[j];
          cardText3.append(dietSpan);
        }
      }
      cardText2.append(calorieSpan);
      cardText2.append(carbsSpan);
      cardText2.append(fatSpan);
      cardText2.append(proteinSpan);
      cardText2.append(sodiumSpan);
      titleAnchorTag.append(recipeTitle);
      cardTitle.append(titleAnchorTag);
      cardBody.append(cardTitle);
      cardBody.append(cardText1);
      cardBody.append(cardText3);
      cardBody.append(cardText2);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.favoriteRecipesContainer.append(recipeCard);
      recipeCard.addEventListener(
        "click",
        this.modalHandler.bind(
          this,
          imageURL,
          title,
          recipeURL,
          id,
          instructions,
          ingredients,
          summary
        )
      );
    }
    if (
      this.domManager.app.favoriteRecipesSection.scrollHeight >
      this.domManager.app.favoriteRecipesSection.clientHeight
    ) {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    this.domManager.app.favoriteRecipesStatusText.classList =
      "text-center d-none";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-hidden";
    this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
  }
}
// ------------- recipes-handler.js end

// ------------- main.js start

document.addEventListener("DOMContentLoaded", () => {
  const appStateManager = new AppStateManager();

  const domManager = new DOMManager();

  const form = new Form(domManager, appStateManager);

  const imageTitleHandler = new ImageTitleHandler(domManager);

  const searchRecipesContainer = document.getElementById(
    "search_recipes_container"
  );
  const favoriteRecipesContainer = document.getElementById(
    "favorite_recipes_container"
  );
  const recipesHandler = new RecipesHandler(
    searchRecipesContainer,
    favoriteRecipesContainer,
    domManager,
    appStateManager
  );

  const app = new App(
    form,
    imageTitleHandler,
    recipesHandler,
    domManager,
    favoriteRecipesContainer,
    appStateManager
  );
  app.start();
});
