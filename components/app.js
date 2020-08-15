const imgurAPIKey = config.imgurAPIKey;
const googleAPIKey = config.googleAPIKey;
const spoonacularAPIKey = config.spoonacularAPIKey;
let favoritedArray;
if (!(localStorage.getItem('favoritedArray'))) {
  favoritedArray = [];
  // localStorage.setItem('favoritedArray', JSON.stringify(favoritedArray));
} else {
  favoritedArray = JSON.parse(localStorage.getItem('favoritedArray'));
}
let restrictionsString;
if (!(localStorage.getItem('restrictionsString'))) {
  restrictionsString = "";
} else {
  restrictionsString = JSON.parse(localStorage.getItem('restrictionsString'));
}
let intolerancesString;
if (!(localStorage.getItem('intolerancesString'))) {
  intolerancesString = [];
} else {
  intolerancesString = JSON.parse(localStorage.getItem('intolerancesString'));
}
const dietMenu = document.getElementById("diet_menu");
let fileInputForm = document.getElementById("file_input_form");
const fileLabel = document.getElementById("custom_file_label");
const searchInput = document.getElementById("recipe_search_input");
const image = document.getElementById("my_image");
const inputs = document.querySelectorAll(".input");
const recipeDownloadText = document.getElementById("recipe_download_text");
const uploadButton = document.getElementById("upload_button");
const searchButton = document.getElementById("search_button");
const recipeSearchInput = document.getElementById('recipe_search_input');
const resetButton = document.getElementById("reset_button");
const openFavoriteButton = document.getElementById("open_favorites_button");
const closeFavoriteButton = document.getElementById("close_favorites_button");
const openDietMenuButton = document.getElementById("open_diet_menu_button");
const closeDietMenuButton = document.getElementById("close_diet_menu_button");
let chunked = [];
let chunkedIncrementor = 0;


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
  constructor(pageHeader, imageTitleContainer, recipesHandler, dietForm) {
    this.pageHeader = pageHeader;
    this.imageTitleContainer = imageTitleContainer;
    this.recipesHandler = recipesHandler;
    this.dietForm = dietForm;
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
    this.getFavoritedRecipes = this.getFavoritedRecipes.bind(this);
    this.handleGetFavoritedRecipesSuccess = this.handleGetFavoritedRecipesSuccess.bind(this);
    this.handleGetFavoritedRecipesError = this.handleGetFavoritedRecipesError.bind(this);
    this.savedDietInfoCheck = this.savedDietInfoCheck.bind(this);
  }

  start() {
    this.pageHeader.clickDietInfo(this.dietInfo);
    this.pageHeader.clickPostImage(this.postImage);
    this.pageHeader.clickGetRecipes(this.getRecipes);
    this.recipesHandler.clickGetFavoritedRecipes(this.getFavoritedRecipes);
    this.dietForm.clickDietInfo(this.dietInfo);
    this.savedDietInfoCheck();
    this.getFavoritedRecipes();
  }

  savedDietInfoCheck() {
    if (!(localStorage.getItem('restrictionsString')) || !(localStorage.getItem('intolerancesString'))) {
      return;
    }
    let restrictionsCheckboxes = document.getElementsByClassName("restriction-checkbox");
    let intolerancesCheckboxes = document.getElementsByClassName("intolerance-checkbox");
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
    var restrictionCheckboxes = document.getElementsByClassName("restriction-checkbox");
    for (var i = 0; i < restrictionCheckboxes.length; i++) {
      if (restrictionCheckboxes[i].checked) {
        restrictionValues += restrictionCheckboxes[i].value + ", ";
      }
    }
    var intoleranceCheckboxes = document.getElementsByClassName("intolerance-checkbox");
    for (var j = 0; j < intoleranceCheckboxes.length; j++) {
      if (intoleranceCheckboxes[j].checked) {
        intoleranceValues += intoleranceCheckboxes[j].value + ", ";
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
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            $('#upload_progress').css({
              width: percentComplete * 100 + '%'
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $('#image_upload_container').removeClass('d-none');
            }
            if (percentComplete === 1) {
              $('#image_upload_container').addClass('d-none');
            }
          }
        }, false);
        return xhr;
      },
      success: this.handlePostImageSuccess,
      error: this.handlePostImageError
    })
  }

  handlePostImageSuccess(data) {
    const imageURL = data.data.link;
    dataForImageRecognition.requests[0].image.source.imageUri = imageURL;
    this.imageTitleContainer.imageOnPage(imageURL);
    this.imageRecognition();
  }

  handlePostImageError(error) {
    console.error(error)
  }

  //POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
  imageRecognition() {
    document.getElementById("title_download_text").className = "text-center";
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
      document.getElementById("title_download_text").className = "d-none";
      document.getElementById("image_not_recognized_text").className = "text-center";
      document.getElementById("my_image").src = "";
      return;
    }
    const imageTitle = response.responses[0].labelAnnotations[0].description;
    this.imageTitleContainer.imageTitleOnPage(imageTitle);
    document.getElementById("title_download_text").className = "text-center d-none";
    this.getRecipes(imageTitle);
  }

  handleImageRecognitionError(error) {
    console.error(error);
  }

  //GET request to Spoonacular's API with label from Google to get a list of up to 10 recipes containing the item from the image and other nutrition info.
  getRecipes(imageTitle) {
    document.getElementById("recipe_download_text").className = "text-center";
    let spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${imageTitle}&apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100`
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json"
      },
      success: this.handleGetRecipesSuccess,
      error: this.handleGetRecipesError
    })
  }

  handleGetRecipesSuccess(recipes) {
    this.recipesHandler.chunkSearchedRecipes(recipes);
  }

  handleGetRecipesError(error) {
    console.error(error);
  }

  getFavoritedRecipes() {
    if (!(localStorage.getItem('favoritedArray'))) {
      document.getElementById("empty_favorite_text").className = "d-flex justify-content-center";
      return;
    }
    document.getElementById("favorite_recipe_download_text").className = "text-center";
    favoritedArray = JSON.parse(localStorage.getItem('favoritedArray'));
    let stringifiedArray = favoritedArray.join(",");
    let spoonacularURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${stringifiedArray}&apiKey=${spoonacularAPIKey}&includeNutrition=true&size=636x393`
    $.ajax({
      method: "GET",
      url: spoonacularURL,
      headers: {
        "Content-Type": "application/json"
      },
      success: this.handleGetFavoritedRecipesSuccess,
      error: this.handleGetFavoritedRecipesError
    })
  }

  handleGetFavoritedRecipesSuccess(recipes) {
    this.recipesHandler.displayFavoritedRecipes(recipes);
  }

  handleGetFavoritedRecipesError(error) {
    console.error(error);
  }
}
