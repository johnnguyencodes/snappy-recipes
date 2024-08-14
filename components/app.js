const imgurAPIKey = config.imgurAPIKey;
const googleAPIKey = config.googleAPIKey;
const spoonacularAPIKey = config.spoonacularAPIKey;
let favoriteArray;
let restrictionsString;
let intolerancesString;
const searchRecipesDownloadText = document.getElementById("search_recipes_download_text");
const searchRecipesDownloadProgress = document.getElementById("search_recipes_download_progress");
const favoriteRecipesDownloadProgress = document.getElementById("favorite_recipes_download_progress");
const noSearchRecipesText = document.getElementById("no_search_recipes_text");
const uploadedImage = document.getElementById("uploaded_image");
let chunkedRecipeArray = [];
let chunkedRecipeArrayIndex = 0;
let restrictionsCheckboxes = document.getElementsByClassName("restriction-checkbox");
let intolerancesCheckboxes = document.getElementsByClassName("intolerance-checkbox");
const imageRecognitionStatusText = document.getElementById("image_recognition_status");
const imageRecognitionFailedText = document.getElementById("image_recognition_failed");
const emptyFavoriteTextContainer = document.getElementById("empty_favorite_text_container");
const favoriteRecipesStatusText = document.getElementById("favorite_recipes_status_text");
const searchResultsQuantityDiv = document.getElementById("search_results_quantity_div");
const resultsShownQuantityDiv = document.getElementById("results_shown_quantity_div");
const imgurAPIError = document.getElementById("imgur_api_error");
const spoonacularSearchError = document.getElementById("spoonacular_search_error");
const spoonacularFavoriteError = document.getElementById("spoonacular_favorite_error");
const spoonacularFavoriteTimeoutError = document.getElementById("spoonacular_favorite_timeout_error");
const titleContainer = document.getElementById("title_container");
const percentageBarContainer = document.getElementById("percentage_bar_container");
const uploadedImageContainer = document.getElementById("uploaded_image_container");
const formElement = document.getElementById("form");
const favoriteRecipesSection = document.getElementById("favorite_recipes_section");
const inputs = document.querySelectorAll(".input");
const searchRecipesDownloadContainer = document.getElementById("search_recipes_download_container");
const imageProcessingContainer = document.getElementById("image_processing_container");
const dietMenu = document.getElementById("diet_menu");
const closePreviewXButton = document.getElementById("close_preview_x_button");
let recipeInformation = null;
let spoonacularError = null;

let dataForImageRecognition = {
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": null
        }
      },
      "features": [
        {
          "type": "LABEL_DETECTION"
        }
      ]
    }
  ]
};

let spoonacularDataToSend = {
  "diet": null,
  "intolerances": null
}

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
    this.handleImageRecognitionSuccess = this.handleImageRecognitionSuccess.bind(this);
    this.handleImageRecognitionError = this.handleImageRecognitionError.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.handleGetRecipesSuccess = this.handleGetRecipesSuccess.bind(this);
    this.handleGetRecipesError = this.handleGetRecipesError.bind(this);
    this.getFavoriteRecipes = this.getFavoriteRecipes.bind(this);
    this.handleGetFavoriteRecipesSuccess = this.handleGetFavoriteRecipesSuccess.bind(this);
    this.handleGetFavoriteRecipesError = this.handleGetFavoriteRecipesError.bind(this);
    this.savedDietInfoCheck = this.savedDietInfoCheck.bind(this);
    this.localStorageCheck = this.localStorageCheck.bind(this);
    this.getRandomRecipes = this.getRandomRecipes.bind(this);
    this.handleGetRandomRecipesSuccess = this.handleGetRandomRecipesSuccess.bind(this);
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
    if (!(localStorage.getItem('favoriteArray'))) {
      favoriteArray = [];
      localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
    } else {
      favoriteArray = JSON.parse(localStorage.getItem('favoriteArray'));
    }
    if (!(localStorage.getItem('restrictionsString'))) {
      restrictionsString = "";
    } else {
      restrictionsString = JSON.parse(localStorage.getItem('restrictionsString'));
    }
    if (!(localStorage.getItem('intolerancesString'))) {
      intolerancesString = [];
    } else {
      intolerancesString = JSON.parse(localStorage.getItem('intolerancesString'));
    }
  }


  savedDietInfoCheck() {
    if (!(localStorage.getItem('restrictionsString')) || !(localStorage.getItem('intolerancesString'))) {
      return;
    }
    let restrictionsArray = JSON.parse(localStorage.getItem('restrictionsString')).split(',');
    let intolerancesArray = JSON.parse(localStorage.getItem('intolerancesString')).split(',');
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
    spoonacularDataToSend.diet = restrictionValues.slice(0, -2).replace(/\s/g, '');
    restrictionsString = spoonacularDataToSend.diet;
    localStorage.setItem('restrictionsString', JSON.stringify(restrictionsString));
    spoonacularDataToSend.intolerances = intoleranceValues.slice(0, -2).replace(/\s/g, '');
    intolerancesString = spoonacularDataToSend.intolerances;
    localStorage.setItem('intolerancesString', JSON.stringify(intolerancesString));
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
        "Authorization": `${imgurAPIKey}`
      },
      // xhr: function () {
      //   var xhr = new window.XMLHttpRequest();
      //   xhr.upload.addEventListener("progress", (evt) => {
      //     if (evt.lengthComputable) {
      //       var percentComplete = evt.loaded / evt.total;
      //       $('#percentage_bar_upload').css({
      //         width: percentComplete * 100 + '%'
      //       });
      //       if (percentComplete > 0 && percentComplete < 1) {
      //         $('#percentage_upload_container').removeClass('d-none');
      //       }
      //       if (percentComplete === 1) {
      //         $('#percentage_upload_container').addClass('d-none');
      //         imageProcessingContainer.className = "d-flex col-12 flex-column align-items-center justify-content-center desktop-space-form";
      //       }
      //     }
      //   }, false);
      //   return xhr;
      // },
      success: this.handlePostImageSuccess,
      error: this.handlePostImageError
    })
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
      error: this.handleImageRecognitionError
    });
  }

  handleImageRecognitionSuccess(response) {
    if (!(response.responses[0].labelAnnotations)) {
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
    searchRecipesDownloadProgress.className = "recipe-progress-visible text-left mt-3";
    searchRecipesDownloadText.className = "text-center mt-3";
    searchRecipesDownloadText.textContent = "Gathering random recipes, please wait..."
    titleContainer.className = "d-none desktop-space-form";
    percentageBarContainer.className = "d-none desktop-space-form";
    uploadedImageContainer.className = "d-none desktop-space-form";
    chunkedRecipeArray = [];
    chunkedRecipeArrayIndex = 0;
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100&sort=random`
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json"
      },
      success: this.handleGetRandomRecipesSuccess,
      error: this.handleGetRecipesError
    })
  }

  handleGetRandomRecipesSuccess(recipes) {
    this.recipesHandler.chunkRandomRecipes(recipes);
  }

  getRecipes(imageTitle) {
    searchRecipesDownloadProgress.className = "recipe-progress-visible text-left mt-3";
    searchRecipesDownloadText.className = "text-center mt-3";
    searchRecipesDownloadText.textContent = "Gathering recipes, please wait..."
    chunkedRecipeArray = [];
    chunkedRecipeArrayIndex = 0;
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${imageTitle}&apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100`
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json"
      },
      error: this.handleGetRecipesError,
      success: this.handleGetRecipesSuccess,
      timeout: 10000
    })
  }

  handleGetRecipesSuccess(recipes) {
    console.log(recipes);
    this.recipesHandler.chunkSearchedRecipes(recipes);
  }

  handleGetRecipesError(error) {
    searchRecipesDownloadContainer.className = "d-none";
    searchRecipesDownloadProgress.className = "recipe-progress-hidden text-left mt-3";
    searchRecipesDownloadText.className = "d-none";
    spoonacularSearchError.className = "text-center mt-3";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.remove("no-click");
    }
    if (error.status === 402) {
      spoonacularSearchError.innerHTML = "The Spoonacular API has reached its daily quota for this app's current API Key. Please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a>, thank you."
      return;
    }
    if (error.statusText === "timeout") {
      spoonacularSearchError.innerHTML = "The ajax request to the Spoonacular API has timed out, please try again."
      return;
    }
    else {
      spoonacularSearchError.innerHTML = "There is a CORS issue with the Spoonacular's API.  This issue will usually resolve itself in ten minutes.  If it does not, please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a >, thank you."
    }
  }

  getFavoriteRecipes() {
    while (favoriteRecipesContainer.firstChild) {
      favoriteRecipesContainer.removeChild(favoriteRecipesContainer.firstChild);
    }
    if (!(localStorage.getItem('favoriteArray')) || localStorage.getItem('favoriteArray') === "[]") {
      emptyFavoriteTextContainer.className = "d-flex justify-content-center";
      return;
    }
    favoriteRecipesSection.className = "favorite-recipes-visible d-flex flex-column justify-content-center"
    emptyFavoriteTextContainer.className = "d-none";
    favoriteRecipesDownloadProgress.className = "favorite-recipe-progress-visible mt-3"
    favoriteRecipesStatusText.className = "text-center";
    favoriteArray = JSON.parse(localStorage.getItem('favoriteArray'));
    let stringifiedArray = favoriteArray.join(",");
    let spoonacularURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${stringifiedArray}&apiKey=${spoonacularAPIKey}&includeNutrition=true&size=636x393`
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 10000,
      error: this.handleGetFavoriteRecipesError,
      success: this.handleGetFavoriteRecipesSuccess
    })
  }

  handleGetFavoriteRecipesSuccess(recipes) {
    this.recipesHandler.displayFavoriteRecipes(recipes);
  }

  handleGetFavoriteRecipesError(error) {
    favoriteRecipesDownloadProgress.className = "favorite-recipe-progress-hidden";
    favoriteRecipesStatusText.className = "d-none";
    if (error.statusText === "error") {
      spoonacularFavoriteError.className = "mt-3 text-center";
    }
    if (error.statusText === "timeout") {
      spoonacularFavoriteTimeoutError.className = "mt-3 text-center";
    }
    }
}
