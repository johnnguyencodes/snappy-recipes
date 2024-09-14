//------ app.js start

const imgurAPIKey = config.imgurAPIKey;
const googleAPIKey = config.googleAPIKey;
const spoonacularAPIKey = config.spoonacularAPIKey;
let favoriteArray;
let restrictionsString;
let intolerancesString;
const searchRecipesDownloadText = document.getElementById(
  "search_recipes_download_text"
);
const searchRecipesDownloadProgress = document.getElementById(
  "search_recipes_download_progress"
);
const favoriteRecipesDownloadProgress = document.getElementById(
  "favorite_recipes_download_progress"
);
const noSearchRecipesText = document.getElementById("no_search_recipes_text");
const uploadedImage = document.getElementById("uploaded_image");
let chunkedRecipeArray = [];
let chunkedRecipeArrayIndex = 0;
let restrictionsCheckboxes = document.getElementsByClassName(
  "restriction-checkbox"
);
let intolerancesCheckboxes = document.getElementsByClassName(
  "intolerance-checkbox"
);
const imageRecognitionStatusText = document.getElementById(
  "image_recognition_status"
);
const imageRecognitionFailedText = document.getElementById(
  "image_recognition_failed"
);
const emptyFavoriteTextContainer = document.getElementById(
  "empty_favorite_text_container"
);
const favoriteRecipesStatusText = document.getElementById(
  "favorite_recipes_status_text"
);
const searchResultsQuantityDiv = document.getElementById(
  "search_results_quantity_div"
);
const resultsShownQuantityDiv = document.getElementById(
  "results_shown_quantity_div"
);
const imgurAPIError = document.getElementById("imgur_api_error");
const spoonacularSearchError = document.getElementById(
  "spoonacular_search_error"
);
const spoonacularFavoriteError = document.getElementById(
  "spoonacular_favorite_error"
);
const spoonacularFavoriteTimeoutError = document.getElementById(
  "spoonacular_favorite_timeout_error"
);
const titleContainer = document.getElementById("title_container");
const percentageBarContainer = document.getElementById(
  "percentage_bar_container"
);
const uploadedImageContainer = document.getElementById(
  "uploaded_image_container"
);
const formElement = document.getElementById("form");
const favoriteRecipesSection = document.getElementById(
  "favorite_recipes_section"
);
const inputs = document.querySelectorAll(".input");
const searchRecipesDownloadContainer = document.getElementById(
  "search_recipes_download_container"
);
const imageProcessingContainer = document.getElementById(
  "image_processing_container"
);
const dietMenu = document.getElementById("diet_menu");
const closePreviewXButton = document.getElementById("close_preview_x_button");
let recipeInformation = null;
let spoonacularError = null;

let dataForImageRecognition = {
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

let spoonacularDataToSend = {
  diet: null,
  intolerances: null,
};

class App {
  constructor(form, imageTitleHandler, recipesHandler) {
    this.form = form;
    this.imageTitleHandler = imageTitleHandler;
    this.recipesHandler = recipesHandler;
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
      favoriteArray = [];
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
    } else {
      favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
    }
    if (!localStorage.getItem("restrictionsString")) {
      restrictionsString = "";
    } else {
      restrictionsString = JSON.parse(
        localStorage.getItem("restrictionsString")
      );
    }
    if (!localStorage.getItem("intolerancesString")) {
      intolerancesString = [];
    } else {
      intolerancesString = JSON.parse(
        localStorage.getItem("intolerancesString")
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
    for (var i = 0; i < restrictionsCheckboxes.length; i++) {
      if (restrictionsArray.includes(restrictionsCheckboxes[i].id)) {
        restrictionsCheckboxes[i].checked = true;
      }
    }
    for (var j = 0; j < intolerancesCheckboxes.length; j++) {
      if (intolerancesArray.includes(intolerancesCheckboxes[j].id)) {
        intolerancesCheckboxes[j].checked = true;
      }
    }
  }

  dietInfo() {
    let restrictionValues = "";
    let intoleranceValues = "";
    for (var i = 0; i < restrictionsCheckboxes.length; i++) {
      if (restrictionsCheckboxes[i].checked) {
        restrictionValues += restrictionsCheckboxes[i].value + ", ";
      }
    }
    for (var j = 0; j < intolerancesCheckboxes.length; j++) {
      if (intolerancesCheckboxes[j].checked) {
        intoleranceValues += intolerancesCheckboxes[j].value + ", ";
      }
    }
    spoonacularDataToSend.diet = restrictionValues
      .slice(0, -2)
      .replace(/\s/g, "");
    restrictionsString = spoonacularDataToSend.diet;
    localStorage.setItem(
      "restrictionsString",
      JSON.stringify(restrictionsString)
    );
    spoonacularDataToSend.intolerances = intoleranceValues
      .slice(0, -2)
      .replace(/\s/g, "");
    intolerancesString = spoonacularDataToSend.intolerances;
    localStorage.setItem(
      "intolerancesString",
      JSON.stringify(intolerancesString)
    );
  }

  //POST request to IMGUR with image id supplied
  postImage(formData) {
    $.ajax({
      method: "POST",
      url: "https://api.imgur.com/3/image/",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      headers: {
        Authorization: `${imgurAPIKey}`,
      },
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          (evt) => {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              $("#percentage_bar_upload").css({
                width: percentComplete * 100 + "%",
              });
              if (percentComplete > 0 && percentComplete < 1) {
                $("#percentage_upload_container").removeClass("d-none");
              }
              if (percentComplete === 1) {
                $("#percentage_upload_container").addClass("d-none");
                imageProcessingContainer.className =
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
    dataForImageRecognition.requests[0].image.source.imageUri = imageURL;
    this.imageTitleHandler.postedImageDownloadProgress(imageURL);
    this.imageRecognition();
  }

  handlePostImageError(error) {
    imgurAPIError.className = "text-center mt-3";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.remove("no-click");
    }
  }

  //POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
  imageRecognition() {
    imageRecognitionStatusText.className = "text-center";
    $.ajax({
      url: `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${googleAPIKey}`,
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",
      data: JSON.stringify(dataForImageRecognition),
      success: this.handleImageRecognitionSuccess,
      error: this.handleImageRecognitionError,
    });
  }

  handleImageRecognitionSuccess(response) {
    if (!response.responses[0].labelAnnotations) {
      imageRecognitionStatusText.className = "d-none";
      imageRecognitionFailedText.className = "text-center";
      uploadedImage.src = "";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    const imageTitle = response.responses[0].labelAnnotations[0].description;
    const score = response.responses[0].labelAnnotations[0].score;
    this.imageTitleHandler.imageTitleOnPage(imageTitle, score);
    imageRecognitionStatusText.className = "text-center d-none";
    this.getRecipes(imageTitle);
  }

  handleImageRecognitionError(error) {
    console.error(error);
  }

  //GET request to Spoonacular's API with label from Google, if available, to get a list of up to 100 recipes.

  getRandomRecipes() {
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
      inputs[i].classList.add("no-click");
    }
    searchRecipesDownloadProgress.className =
      "recipe-progress-visible text-left mt-3";
    searchRecipesDownloadText.className = "text-center mt-3";
    searchRecipesDownloadText.textContent =
      "Gathering random recipes, please wait...";
    titleContainer.className = "d-none desktop-space-form";
    percentageBarContainer.className = "d-none desktop-space-form";
    uploadedImageContainer.className = "d-none desktop-space-form";
    chunkedRecipeArray = [];
    chunkedRecipeArrayIndex = 0;
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100&sort=random`;
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: spoonacularDataToSend,
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
    searchRecipesDownloadProgress.className =
      "recipe-progress-visible text-left mt-3";
    searchRecipesDownloadText.className = "text-center mt-3";
    searchRecipesDownloadText.textContent = "Gathering recipes, please wait...";
    chunkedRecipeArray = [];
    chunkedRecipeArrayIndex = 0;
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${imageTitle}&apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100`;
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
      error: this.handleGetRecipesError,
      success: this.handleGetRecipesSuccess,
      timeout: 10000,
    });
  }

  handleGetRecipesSuccess(recipes) {
    console.log(recipes);
    this.recipesHandler.chunkSearchedRecipes(recipes);
  }

  handleGetRecipesError(error) {
    searchRecipesDownloadContainer.className = "d-none";
    searchRecipesDownloadProgress.className =
      "recipe-progress-hidden text-left mt-3";
    searchRecipesDownloadText.className = "d-none";
    spoonacularSearchError.className = "text-center mt-3";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.remove("no-click");
    }
    if (error.status === 402) {
      spoonacularSearchError.innerHTML =
        "The Spoonacular API has reached its daily quota for this app's current API Key. Please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a>, thank you.";
      return;
    }
    if (error.statusText === "timeout") {
      spoonacularSearchError.innerHTML =
        "The ajax request to the Spoonacular API has timed out, please try again.";
      return;
    } else {
      spoonacularSearchError.innerHTML =
        "There is a CORS issue with the Spoonacular's API.  This issue will usually resolve itself in ten minutes.  If it does not, please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a >, thank you.";
    }
  }

  getFavoriteRecipes() {
    while (favoriteRecipesContainer.firstChild) {
      favoriteRecipesContainer.removeChild(favoriteRecipesContainer.firstChild);
    }
    if (
      !localStorage.getItem("favoriteArray") ||
      localStorage.getItem("favoriteArray") === "[]"
    ) {
      emptyFavoriteTextContainer.className = "d-flex justify-content-center";
      return;
    }
    favoriteRecipesSection.className =
      "favorite-recipes-visible d-flex flex-column justify-content-center";
    emptyFavoriteTextContainer.className = "d-none";
    favoriteRecipesDownloadProgress.className =
      "favorite-recipe-progress-visible mt-3";
    favoriteRecipesStatusText.className = "text-center";
    favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
    let stringifiedArray = favoriteArray.join(",");
    let spoonacularURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${stringifiedArray}&apiKey=${spoonacularAPIKey}&includeNutrition=true&size=636x393`;
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
    favoriteRecipesDownloadProgress.className =
      "favorite-recipe-progress-hidden";
    favoriteRecipesStatusText.className = "d-none";
    if (error.statusText === "error") {
      spoonacularFavoriteError.className = "mt-3 text-center";
    }
    if (error.statusText === "timeout") {
      spoonacularFavoriteTimeoutError.className = "mt-3 text-center";
    }
  }
}

// --------- app.js end

// --------- image-title-handler.js start

class ImageTitleHandler {
  constructor() {}

  postedImageDownloadProgress(imageURL) {
    imageProcessingContainer.className = "d-none desktop-space-form";
    let imageURLParameter = imageURL;
    let imageLoader = {};
    imageLoader["LoadImage"] = (imageURLParameter, progressUpdateCallback) => {
      return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", imageURL, true);
        xhr.responseType = "arraybuffer";
        xhr.onprogress = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            var percentComplete = progressEvent.loaded / progressEvent.total;
            $("#percentage_bar_download").css({
              width: percentComplete * 100 + "%",
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $("#percentage_download_container").removeClass("d-none");
            }
            if (percentComplete === 1) {
              $("#percentage_download_container").addClass("d-none");
              percentageBarContainer.className = "d-none desktop-space-form";
            }
          }
        };
        xhr.onloadend = () => {
          var options = {};
          var headers = xhr.getAllResponseHeaders();
          var typeMatch = headers.match(/^Content-Type:\s*(.*?)$/im);

          if (typeMatch && typeMatch[1]) {
            options.type = typeMatch[1];
          }

          var blob = new Blob([this.response], options);
          resolve(window.URL.createObjectURL(blob));
        };
        xhr.send();
      });
    };
    this.imageLoaderFunction(imageLoader, imageURLParameter);
  }

  imageLoaderFunction(imageLoader, imageURL) {
    imageLoader.LoadImage("imageURL").then((image) => {
      uploadedImage.src = imageURL;
    });
  }

  imageTitleOnPage(imageTitle, score) {
    const h2 = document.createElement("h1");
    h2.id = "image_title";
    h2.className = "text-center";
    h2.textContent = imageTitle;
    titleContainer.append(h2);
    const p = document.createElement("p");
    p.id = "title_score";
    p.className = "text-center";
    const percent = (score * 100).toFixed(2);
    p.textContent = `Confidence: ${percent}%`;
    titleContainer.append(p);
    const hr = document.createElement("hr");
    hr.id = "hr";
    hr.className = "mx-3 my-0 py-0 d-xl-none";
    titleContainer.append(hr);
  }
}

// --------- image-title-handler.js end

// --------- form.js start

const fileLabel = document.getElementById("custom_file_label");
let fileInputForm = document.getElementById("file_input_form");
const recipeSearchInput = document.getElementById("recipe_search_input");
const resetButton = document.getElementById("reset_button");
const searchButton = document.getElementById("search_button");
const toggleFavoritesButton = document.getElementById(
  "toggle_favorites_button"
);
const toggleDietButton = document.getElementById("toggle_diet_button");
const mainContent = document.getElementById("main_content");
const errorContainer = document.getElementById("error_container");
const errorSpoonacularSearch = document.getElementById(
  "spoonacular_search_error"
);
const errorImgurCORSIssue = document.getElementById("imgur_api_error");
const errorNoFile = document.getElementById("error_no_file");
const errorIncorrectFile = document.getElementById("error_incorrect_file");
const errorFileExceedsSize = document.getElementById("error_file_exceeds_size");
const errorNoSearchResults = document.getElementById("no_search_recipes_text");
const openSideMenuButton = document.getElementById("open_side_menu_button");
const closeSideMenuButton = document.getElementById("close_side_menu_button");
const sideMenuContainer = document.getElementById("side_menu_container");
const userInputContainer = document.getElementById("user_input_container");
const headerElement = document.getElementById("header_element");
const favoriteStickyDiv = document.getElementById("favorite_sticky_div");

let favoriteYPosition;
let userInputContainerYPosition;
let rect;

class Form {
  constructor() {
    favoriteRecipesSection.addEventListener(
      "scroll",
      this.keepUserInputContainerPosition.bind(this)
    );
    openSideMenuButton.addEventListener("click", this.openSideMenu.bind(this));
    closeSideMenuButton.addEventListener(
      "click",
      this.closeSideMenu.bind(this)
    );
    toggleFavoritesButton.addEventListener(
      "click",
      this.toggleFavorites.bind(this)
    );
    toggleDietButton.addEventListener("click", this.toggleDiet.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.imgValidation.bind(this));
    overlay.addEventListener("click", this.closeSideMenu.bind(this));
    recipeSearchInput.addEventListener("keyup", this.enterSearch.bind(this));
    fileLabel.addEventListener("dragover", this.imgValidation.bind(this));
    document.addEventListener("drop", function (event) {
      if (event.target !== fileInputForm) {
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
    favoriteRecipesSection.className =
      "d-flex flex-column justify-content-center";
    dietMenu.className =
      "d-none flex-column justify-content-center align-items-center";
    toggleFavoritesButton.classList.add("font-weight-bold");
    toggleDietButton.classList.remove("font-weight-bold");
  }

  toggleDiet() {
    event.preventDefault();
    favoriteRecipesSection.className =
      "d-none flex-column justify-content-center";
    dietMenu.className =
      "d-flex flex-column justify-content-center align-items-center";
    toggleFavoritesButton.classList.remove("font-weight-bold");
    toggleDietButton.classList.add("font-weight-bold");
  }

  openFavorites() {
    event.preventDefault();
    favoriteYPosition = window.scrollY;
    favoriteRecipesSection.className =
      "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (
      !localStorage.getItem("favoriteArray") ||
      localStorage.getItem("favoriteArray") !== "[]"
    ) {
      emptyFavoriteTextContainer.className = "d-none";
    }
    mainContent.className = "row main-content-right noscroll";
    mainContent.style.top = `-${favoriteYPosition}px`;
    formElement.style.top = "0px";
    formElement.className =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    overlay.className = "";
    this.getFavoriteRecipes();
  }

  closeFavorites() {
    event.preventDefault();
    favoriteRecipesSection.className =
      "favorite-recipes-hidden d-flex flex-column justify-content-center";
    mainContent.className = "row";
    overlay.className = "d-none";
    window.scroll(0, favoriteYPosition);
    formElement.className =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    favoriteRecipesDownloadProgress.className =
      "recipe-progress-hidden mt-3 text-center";
    spoonacularFavoriteError.className = "d-none";
    spoonacularFavoriteTimeoutError.className = "d-none";
  }

  openSideMenu() {
    event.preventDefault();
    favoriteYPosition = window.scrollY;
    rect = userInputContainer.getBoundingClientRect();
    closeSideMenuButton.className =
      "close-side-menu-button-visible d-flex justify-content-center align-items-center text-danger p-0 m-0";
    toggleFavoritesButton.className =
      "favorites-toggle-visible toggle btn btn-danger text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center font-weight-bold";
    favoriteStickyDiv.className = "favorite-sticky-div-visible m-0 p-0";
    toggleDietButton.className =
      "diet-toggle-visible toggle btn btn-primary text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center";
    sideMenuContainer.className =
      "side-menu-visible d-flex flex-column justify-content-center align-items-center";
    favoriteRecipesSection.className =
      "d-flex flex-column justify-content-center";
    dietMenu.className =
      "d-none flex-column justify-content-center align-items-center";
    mainContent.className = "row main-content-right noscroll";
    overlay.className = "";
    mainContent.style.top = `-${favoriteYPosition}px`;
    headerElement.className =
      "d-flex flex-column align-items-center justify-content-center my-2 px-0";
    formElement.style.top = "0px";
    formElement.className =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    userInputContainer.className =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    mainContent.style.top = `-${favoriteYPosition}px - 50px`;
    this.getFavoriteRecipes();
  }

  keepUserInputContainerPosition() {
    console.log("rect", rect);
    console.log("scrollY", userInputContainer.scrollY);
    if (
      document
        .getElementById("side_menu_container")
        .classList.contains("side-menu-visible") &&
      document.getElementById("diet_menu").classList.contains("d-none")
    ) {
      userInputContainer.scrollY = rect.top;
    } else return;
  }

  closeSideMenu() {
    event.preventDefault();
    closeSideMenuButton.className =
      "close-side-menu-button-hidden d-flex justify-content-center align-items-center text-danger p-0 m-0";
    toggleFavoritesButton.className =
      "favorites-toggle-hidden toggle btn btn-danger text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center";
    toggleDietButton.className =
      "diet-toggle-hidden toggle btn btn-primary text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center";
    favoriteStickyDiv.className = "favorite-sticky-div-hidden m-0 p-0";
    sideMenuContainer.className =
      "side-menu-hidden d-flex flex-column justify-content-center align-items-center";
    mainContent.className = "row";
    overlay.className = "d-none";
    window.scroll(0, favoriteYPosition);
    formElement.className =
      "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    headerElement.className =
      "static d-flex flex-column align-items-center justify-content-center my-2 px-0";
    favoriteRecipesDownloadProgress.className =
      "favorite-recipe-progress-hidden mt-3 text-center";
    spoonacularFavoriteError.className = "d-none";
    spoonacularFavoriteTimeoutError.className = "d-none";
    userInputContainer.className =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    this.dietInfo();
  }

  imgValidation(event) {
    event.preventDefault();
    if (!fileInputForm.files[0]) {
      return;
    }
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
      inputs[i].classList.add("no-click");
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
    percentageBarContainer.className =
      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
    uploadedImage.src = "";
    searchResultsQuantityDiv.className = "d-none";
    resultsShownQuantityDiv.className = "d-none";
    imageRecognitionFailedText.className = "d-none";
    errorContainer.className = "d-none desktop-space-form";
    errorNoFile.className = "d-none";
    errorIncorrectFile.className = "d-none";
    errorFileExceedsSize.className = "d-none";
    errorSpoonacularSearch.className = "d-none";
    errorNoSearchResults.className = "d-none";
    errorImgurCORSIssue.className = "d-none";
    errorNoSearchResults.className = "d-none";
    titleContainer.className =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-around flex-column desktop-space-form mb-3";
    percentageBarContainer.className =
      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
    uploadedImageContainer.className =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center my-3 desktop-space-form";
    if (fileInputForm.files[1]) {
      fileInputForm.files.splice(1, 1);
    }
    const imageFile = fileInputForm.files[0];
    if (!imageFile) {
      errorContainer.className = "col-12 mt-2 desktop-space-form";
      errorNoFile.className = "text-danger text-center";
      fileInputForm.value = "";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!mimeTypes.includes(fileType)) {
      errorContainer.className = "col-12 mt-2 desktop-space-form";
      errorIncorrectFile.className = "text-danger text-center";
      fileInputForm.value = "";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    if (imageFile.size > 10485760) {
      errorContainer.className = "col-12 mt-2 desktop-space-form";
      errorFileExceedsSize.className = "text-danger text-center";
      fileInputForm.value = "";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    formData.append("image", imageFile);
    this.dietInfo();
    this.postImage(formData);
    fileInputForm.value = "";
  }

  search(event) {
    event.preventDefault();
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    searchResultsQuantityDiv.className = "d-none";
    resultsShownQuantityDiv.className = "d-none";
    imageRecognitionFailedText.className = "d-none";
    errorContainer.className = "d-none desktop-space-form";
    errorNoFile.className = "d-none";
    errorIncorrectFile.className = "d-none";
    errorFileExceedsSize.className = "d-none";
    errorSpoonacularSearch.className = "d-none";
    errorNoSearchResults.className = "d-none";
    errorImgurCORSIssue.className = "d-none";
    errorNoSearchResults.className = "d-none";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
      inputs[i].classList.add("no-click");
    }
    let query = recipeSearchInput.value;
    this.dietInfo();
    titleContainer.className = "d-none desktop-space-form";
    percentageBarContainer.className = "d-none desktop-space-form";
    uploadedImageContainer.className = "d-none desktop-space-form";
    if (!query) {
      this.getRandomRecipes();
      return;
    }
    this.getRecipes(query);
  }
}

// ---------- form.js end

// ----------- recipes-handler.js start

const searchResultsQuantityText = document.getElementById(
  "search_results_quantity_text"
);
const modalContainer = document.getElementById("modal_container");
const resultsShownQuantityText = document.getElementById(
  "results_shown_quantity_text"
);
const body = document.querySelector("body");
const favoriteButton = document.getElementById("favorite_button");
const backToTopButton = document.getElementById("back_to_top_button");
const recipeInstructions = document.getElementById("recipe_instructions");
const recipeIngredients = document.getElementById("recipe_ingredients");
const modalButtonContainer = document.getElementById("modal_button_container");
const overlayPreview = document.getElementById("overlay_preview");
const modalDialog = document.getElementById("modal_dialog");

class RecipesHandler {
  constructor(searchRecipesContainer, favoriteRecipesContainer) {
    this.searchRecipesContainer = searchRecipesContainer;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    window.addEventListener("scroll", this.handleShowMoreScroll.bind(this));
    backToTopButton.addEventListener(
      "click",
      this.handleBackToTopClick.bind(this)
    );
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown =
      this.updateResultsQuantityShown.bind(this);
    this.favoriteCheck = this.favoriteCheck.bind(this);
    modalContainer.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
    closePreviewXButton.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
  }

  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkSearchedRecipes(recipes) {
    recipeInformation = recipes;
    if (!recipes.results[0]) {
      searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
      searchRecipesDownloadText.className = "d-none";
      noSearchRecipesText.className = "text-center mt-3";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    searchResultsQuantityDiv.className = "d-flex justify-content-center mt-3";
    searchResultsQuantityText.textContent = `${recipes.results.length} recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      chunkedRecipeArray.push(recipes.results.slice(a, a + 12));
      a = a + 12;
    }
    this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
    if (recipes.results.length > 12) {
      resultsShownQuantityDiv.className =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  chunkRandomRecipes(recipes) {
    recipeInformation = recipes;
    if (!recipes.results[0]) {
      searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
      searchRecipesDownloadText.className = "d-none";
      noSearchRecipesText.className = "text-center mt-3";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    searchResultsQuantityDiv.className = "d-flex justify-content-center mt-3";
    searchResultsQuantityText.textContent = `${recipes.results.length} random recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      chunkedRecipeArray.push(recipes.results.slice(a, a + 12));
      a = a + 12;
    }
    this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
    if (recipes.results.length > 12) {
      resultsShownQuantityDiv.className =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  handleShowMoreScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      if (chunkedRecipeArrayIndex !== chunkedRecipeArray.length - 1) {
        let yPosition = window.scrollY;
        chunkedRecipeArrayIndex++;
        this.displaySearchedRecipes(
          chunkedRecipeArray,
          chunkedRecipeArrayIndex
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
    resultsShownQuantityText.textContent = `Showing ${
      document.querySelectorAll(".recipe-card").length
    } of ${searchResultsQuantityText.textContent.substring(0, 3)}`;
  }

  handleFavoriteClick(id) {
    event.stopPropagation();
    let heartIcon = document.getElementById(`heart_icon_${id}`);
    let recipeTitle =
      heartIcon.parentNode.parentNode.parentNode.lastChild.firstChild.firstChild
        .firstChild.textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    if (!favoriteArray.includes(id)) {
      favoriteArray.push(id);
      heartIcon.className = "fas fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.className =
        "recipe-card favorited card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      Toastify({
        text: `${twoWords}... added`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      heartIcon.className = "far fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.className =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      Toastify({
        text: `${twoWords}... removed`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
    }
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  }

  handleDeleteClick(id) {
    event.stopPropagation();
    let deleteCard = document.getElementById(`${id}`);
    let recipeTitle =
      deleteCard.firstChild.nextSibling.firstChild.firstChild.firstChild
        .textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    favoriteArray.splice(favoriteArray.indexOf(id), 1);
    document.getElementById(`${id}`).remove();
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
    if (localStorage.getItem("favoriteArray") === "[]") {
      emptyFavoriteTextContainer.className = "d-flex justify-content-center";
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    if (
      favoriteRecipesSection.scrollHeight > favoriteRecipesSection.clientHeight
    ) {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    Toastify({
      text: `${twoWords}... removed`,
      duration: 1500,
      newWindow: true,
      gravity: "bottom",
      position: "left",
    }).showToast();
    this.favoriteCheck(id);
  }

  handleFavoriteButtonClick(id) {
    event.stopPropagation();
    const favoriteButton = document.getElementById("favorite_button");
    let recipeTitle = document.getElementById("recipe_title").textContent;
    let twoWords = recipeTitle.split(" ").slice(2, 4).join(" ");
    if (favoriteArray.includes(id) === false) {
      favoriteArray.push(id);
      favoriteButton.className = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
      Toastify({
        text: `${twoWords}... added`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).className =
          "fas fa-heart text-danger heart-icon fa-lg";
      }
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      if (
        favoriteRecipesSection.classList.contains("favorite-recipes-visible")
      ) {
        this.getFavoriteRecipes();
        spoonacularFavoriteError.className = "d-none";
        spoonacularFavoriteTimeoutError.className = "d-none";
      }
      return;
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      favoriteButton.className = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).className =
          "far fa-heart text-danger heart-icon fa-lg";
      }
      if (document.getElementById(`${id}`)) {
        document.getElementById(`${id}`).remove();
      }
      if (
        favoriteRecipesSection.scrollHeight >
          favoriteRecipesSection.clientHeight &&
        favoriteRecipesSection.classList.contains("favorite-recipes-visible")
      ) {
        favoriteRecipesSection.className =
          "favorite-recipes-visible d-flex flex-column justify-content-start";
      } else {
        favoriteRecipesSection.className =
          "favorite-recipes-visible d-flex flex-column justify-content-center";
      }
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      if (
        !localStorage.getItem("favoriteArray") ||
        localStorage.getItem("favoriteArray") === "[]"
      ) {
        emptyFavoriteTextContainer.className = "d-flex justify-content-center";
        return;
      }
      Toastify({
        text: `${twoWords}... removed`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
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
    for (var i = 0; i < searchedArray.length; i++) {
      if (
        favoriteArrayToCheck.includes(
          parseInt(searchedArray[i].id.substring(11))
        )
      ) {
        searchedArray[i].className =
          "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        searchedArray[i].className =
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
    overlayPreview.className = "";
    externalLinkButton.id = "external_link_button";
    externalLinkButton.className = "btn btn-primary text-white";
    externalLinkButton.textContent = "Recipe Page";
    const favoriteButton = document.createElement("button");
    favoriteButton.id = "favorite_button";
    // const closePreviewButton = document.createElement("button");
    // closePreviewButton.id = "go_back_button";
    // closePreviewButton.className = "btn btn-secondary";
    // closePreviewButton.textContent = "Close Preview";
    closePreviewXButton.className =
      "close-preview-x-button-visible justify-content-center align-items-center text-danger p-0 m-0";
    modalButtonContainer.append(externalLinkButton);
    modalButtonContainer.append(favoriteButton);
    // modalButtonContainer.append(closePreviewButton);
    for (var x = 0; x < ingredients.length; x++) {
      const ingredient = document.createElement("li");
      ingredient.textContent = `${ingredients[x].amount} ${ingredients[x].unit} ${ingredients[x].name}`;
      recipeIngredients.append(ingredient);
    }
    const cleanSummary = DOMPurify.sanitize(summary);
    modalContainer.className = "";
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = cleanSummary;
    body.className = "bg-light freeze";
    externalLinkButton.addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });
    favoriteButton.addEventListener(
      "click",
      this.handleFavoriteButtonClick.bind(this, id)
    );
    if (favoriteArray.includes(id)) {
      favoriteButton.className = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
    } else {
      favoriteButton.className = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
    }
    // closePreviewButton.addEventListener("click", this.closePreview.bind(this));
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i] === "var article") {
        return;
      }
      const step = document.createElement("li");
      step.textContent = instructions[i];
      recipeInstructions.append(step);
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
      modalContainer.className = "d-none justify-content-center";
      body.className = "bg-light";
      overlayPreview.className = "d-none";
      while (recipeInstructions.firstChild) {
        recipeInstructions.removeChild(recipeInstructions.firstChild);
      }
      while (recipeIngredients.firstChild) {
        recipeIngredients.removeChild(recipeIngredients.firstChild);
      }
      while (modalButtonContainer.firstChild) {
        modalButtonContainer.removeChild(modalButtonContainer.firstChild);
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
      recipeCard.className =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      recipeCard.id = "recipe";
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.className = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.className =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.className = "mb-1 p-0";
      img.width = "240";
      img.height = "180";
      const heartIconContainer = document.createElement("span");
      heartIconContainer.id = "heart_container";
      heartIconContainer.className =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const heartIcon = document.createElement("i");
      heartIcon.id = `heart_icon_${id}`;
      if (favoriteArray.includes(id)) {
        heartIcon.className = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        heartIcon.className = "far fa-heart text-danger heart-icon fa-lg";
      }
      heartIconContainer.append(heartIcon);
      imageContainer.append(heartIconContainer);
      heartIconContainer.addEventListener(
        "click",
        this.handleFavoriteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.className = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.className = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.className = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.className = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.className = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.className = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.className = "card-text d-flex flex-wrap";
      let dietSpan;
      if (chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets) {
        for (
          var j = 0;
          j < chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets.length;
          j++
        ) {
          dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
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
    searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
    searchRecipesDownloadText.className = "d-none";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.remove("no-click");
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
      recipeCard.className =
        "favorite-recipe-card favorited card m-3 px-0 col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2";
      recipeCard.id = id;
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.className = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.className =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.className = "m-0 p-0";
      img.width = "240";
      img.height = "180";
      const deleteIconContainer = document.createElement("span");
      deleteIconContainer.id = "delete_container";
      deleteIconContainer.className =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "far fa-trash-alt text-danger delete-icon fa-lg";
      deleteIconContainer.append(deleteIcon);
      imageContainer.append(deleteIconContainer);
      deleteIconContainer.addEventListener(
        "click",
        this.handleDeleteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.className = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.className = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.className = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.className = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.className = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.className = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.className = "card=text d-flex flex-wrap";
      if (recipes[i].diets) {
        for (var j = 0; j < recipes[i].diets.length; j++) {
          const dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
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
      favoriteRecipesSection.scrollHeight > favoriteRecipesSection.clientHeight
    ) {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    favoriteRecipesStatusText.className = "text-center d-none";
    favoriteRecipesDownloadProgress.className =
      "favorite-recipe-progress-hidden";
    emptyFavoriteTextContainer.className = "d-none";
  }
}
// ------------- recipes-handler.js end

// ------------- main.js start

const form = new Form();

const imageTitleHandler = new ImageTitleHandler();

const searchRecipesContainer = document.getElementById(
  "search_recipes_container"
);
const favoriteRecipesContainer = document.getElementById(
  "favorite_recipes_container"
);
const recipesHandler = new RecipesHandler(
  searchRecipesContainer,
  favoriteRecipesContainer
);

const app = new App(form, imageTitleHandler, recipesHandler);
app.start();
