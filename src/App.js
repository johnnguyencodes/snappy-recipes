export class App {
  constructor(
    form,
    imageTitleHandler,
    recipesHandler,
    domManager,
    favoriteRecipesContainer,
    appStateManager
  ) {
    this.form = form;
    this.imageTitleHandler = imageTitleHandler;
    this.recipesHandler = recipesHandler;
    this.domManager = domManager;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    this.appStateManager = appStateManager;

    this.init();
  }

  // Initialize event handlers and start app functions
  init() {
    this.setupBindings();
    this.start();
  }

  setupBindings() {
    this.dietInfo = this.dietInfo.bind(this);
    this.postImage = this.postImage.bind(this);
    this.imageRecognition = this.imageRecognition.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.getFavoriteRecipes = this.getFavoriteRecipes.bind(this);
    this.getRandomRecipes = this.getRandomRecipes.bind(this);
  }

  start() {
    this.localStorageCheck();
    this.savedDietInfoCheck();
    this.dietInfo();
    this.getRandomRecipes();

    const formEvents = {
      clickDietInfo: this.dietInfo,
      clickPostImage: this.postImage,
      clickGetRecipes: this.getRecipes,
      clickGetFavoriteRecipes: this.getFavoriteRecipes,
      clickGetRandomRecipes: this.getRandomRecipes,
    };

    for (const [event, handler] of Object.entries(formEvents)) {
      this.form[event](handler);
    }

    this.recipesHandler.clickGetFavoriteRecipes(this.getFavoriteRecipes);
    this.refreshAccessToken(this.appStateManager.getState("imgurRefreshToken"));
  }

  // Helper function for localStorage checks
  checkLocalStorage(key, defaultValue = null) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      this.appStateManager.setState(key, defaultValue);
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } else {
      this.appStateManager.setState(key, JSON.parse(storedValue));
    }
  }

  localStorageCheck() {
    this.checkLocalStorage("favoriteArray", []);
    this.checkLocalStorage("diet", "");
    this.checkLocalStorage("intolerances", "");
  }

  savedDietInfoCheck() {
    const dietArray = this.getLocalStorageArray("diet");
    const intolerancesArray = this.getLocalStorageArray("intolerances");

    Array.from(this.domManager.app.dietCheckboxes).forEach((checkbox) => {
      checkbox.checked = dietArray.includes(checkbox.id);
    });

    Array.from(this.domManager.app.intolerancesCheckboxes).forEach(
      (checkbox) => {
        checkbox.checked = intolerancesArray.includes(checkbox.id);
      }
    );
  }

  // Helper for retrieving an array from localStorage
  getLocalStorageArray(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue).split(",") : [];
  }

  dietInfo() {
    const getCheckedValues = (checkboxes) => {
      // Convert checkboxes to an array and filter/map them
      return Array.from(checkboxes)
        .filter((box) => box.checked)
        .map((box) => box.value)
        .join(", ")
        .replace(/\s/g, "");
    };

    const diet = getCheckedValues(this.domManager.app.dietCheckboxes);
    const intolerances = getCheckedValues(
      this.domManager.app.intolerancesCheckboxes
    );

    this.updateDietInfo("diet", diet);
    this.updateDietInfo("intolerances", intolerances);
  }

  // Update and store diet info in appState and localStorage
  updateDietInfo(key, value) {
    this.domManager.app.spoonacularDataToSend[key] = value;
    this.appStateManager.setState(key, value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  //POST request to IMGUR with image id supplied
  postImage(formData) {
    const imgurAccessToken = this.appStateManager.getState("imgurAccessToken");
    console.log(formData);

    $.ajax({
      // to see the uploaded image on the page, MAKE SURE to open html page using live server with the `use local ip` setting checked
      // Imgur will not load images on the page if the ip address starts with 127.0.0.1
      method: "POST",
      url: "https://api.imgur.com/3/image/",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      headers: {
        Authorization: `Bearer ${imgurAccessToken}`,
      },
      xhr: function () {
        const xhr = new window.XMLHttpRequest();

        // Helper function to update the progress bar
        const updateProgressBar = (percentComplete) => {
          $("#percentage_bar_upload").css({
            width: `${percentComplete * 100}%`,
          });
        };

        // Helper function to toggle the upload container visibility
        const toggleUploadContainer = (percentComplete) => {
          if (percentComplete > 0 && percentComplete < 1) {
            $("#percentage_upload_container").removeClass("d-none");
          } else if (percentComplete === 1) {
            $("#percentage_upload_container").addClass("d-none");
          }
        };

        // Helper function to show the image processing container
        const showImageProcessingContainer = () => {
          document.getElementById("image_processing_container").classList =
            "d-flex col-12 flex-column align-items-center justify-content-center desktop-space-form";
        };

        // Event listener for upload progress
        xhr.upload.addEventListener(
          "progress",
          (evt) => {
            if (evt.lengthComputable) {
              const percentComplete = evt.loaded / evt.total;

              updateProgressBar(percentComplete);
              toggleUploadContainer(percentComplete);

              if (percentComplete === 1) {
                showImageProcessingContainer();
              }
            }
          },
          false
        );

        return xhr;
      },
      success: this.onPostImageSuccess,
      error: this.onPostImageError,
    });
  }

  onPostImageSuccess = (data) => {
    const imageURL = data.data.link;
    this.domManager.app.dataForImageRecognition.requests[0].image.source.imageUri =
      imageURL;
    this.imageTitleHandler.postedImageDownloadProgress(imageURL);
    this.imageRecognition();
  };

  handlePostImageError(error) {
    console.error("error", error);
    this.toggleInputs(false);
    this.domManager.app.imgurAPIError.classList = "text-center mt-3";
  }

  toggleInputs(isDisabled) {
    this.domManager.app.inputs.forEach((input) => {
      input.disabled = isDisabled;
      input.classList.toggle("no-click", isDisabled);
    });
  }

  // refresh imgurAccessToken
  async refreshAccessToken() {
    const clientId = this.appStateManager.getState("imgurClientID");
    const clientSecret = this.appStateManager.getState("imgurClientSecret");
    const imgurRefreshToken =
      this.appStateManager.getState("imgurRefreshToken");

    const response = await fetch("https://api.imgur.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: imgurRefreshToken,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      this.appStateManager.setState("imgurAccessToken", data.access_token);
    } else {
      console.error("Error refreshing token:", data);
    }
  }

  //POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
  imageRecognition() {
    this.domManager.app.imageRecognitionStatusText.classList = "text-center";

    const googleAPIKey = this.appStateManager.getState("googleAPIKey");
    const url = `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${googleAPIKey}`;

    $.ajax({
      url,
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",
      data: JSON.stringify(this.domManager.app.dataForImageRecognition),
      success: this.onImageRecognitionSuccess,
      error: this.onImageRecognitionError,
    });
  }

  onImageRecognitionSuccess = (response) => {
    const labelAnnotations = response.responses[0]?.labelAnnotations;
    if (!labelAnnotations) {
      this.showRecognitionFailure();
      return;
    }

    const [firstAnnotation] = labelAnnotations;
    const { description: imageTitle, score } = firstAnnotation;

    this.imageTitleHandler.imageTitleOnPage(imageTitle, score);
    this.domManager.app.imageRecognitionStatusText.classList = "d-none";

    // Get recipes based on title
    this.getRecipes(imageTitle);
  };

  onImageRecognitionError = (error) => {
    console.error("Image recognition error:", error);
    // Add error UI handling here
  };

  showRecognitionFailure() {
    this.domManager.app.imageRecognitionStatusText.classList = "d-none";
    this.domManager.app.imageRecognitionFailedText.classList = "text-center";
    this.domManager.app.uploadedImage.src = "";
    this.toggleInputs(false);
  }

  //GET request to Spoonacular's API with label from Google (image title)
  getRecipes(imageTitle) {
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-visible text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList =
      "text-center mt-3";
    this.domManager.app.searchRecipesDownloadText.textContent =
      "Gathering recipes, please wait...";

    this.prepareForRecipesSearch();

    const spoonacularAPIKey =
      this.appStateManager.getState("spoonacularAPIKey");
    const spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${imageTitle}&apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&636x393&number=100`;

    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: this.domManager.app.spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
      success: this.onGetRecipesSuccess,
      error: this.onGetRecipesError,
      timeout: 10000,
    });
  }

  onGetRecipesSuccess = (recipes) => {
    this.recipesHandler.chunkSearchedRecipes(recipes);
  };

  onGetRecipesError = (error) => {
    this.handleRecipeError(
      error,
      "searchRecipesDownloadContainer",
      "spoonacularSearchError"
    );
  };

  prepareForRecipesSearch() {
    this.appStateManager.setState("chunkedRecipeArray", []);
    this.appStateManager.setState("chunkedRecipeArrayIndex", 0);
  }

  // GET random recipes from Spoonacular's API
  getRandomRecipes() {
    if (this.appStateManager.isGetRandomRecipesCalled) return;
    this.appStateManager.setState("isGetRandomRecipesCalled", true);

    this.toggleInputs(true);

    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-visible text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList =
      "text-center mt-3";
    this.domManager.app.searchRecipesDownloadText.textContent =
      "Gathering random recipes, please wait...";

    this.prepareForRecipesSearch();

    this.domManager.app.titleContainer.classList = "d-none desktop-space-form";
    this.domManager.app.percentageBarContainer.classList =
      "d-none desktop-space-form";
    this.domManager.app.uploadedImageContainer.classList =
      "d-none desktop-space-form";

    const spoonacularAPIKey =
      this.appStateManager.getState("spoonacularAPIKey");
    const spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPIKey}&addRecipeNutrition=true&number=100`;

    $.ajax({
      method: "GET",
      url: spoonacularURL,
      data: this.domManager.app.spoonacularDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
      success: this.onGetRandomRecipesSuccess,
      error: this.onGetRecipesError,
    });
  }

  onGetRandomRecipesSuccess = (recipes) => {
    this.recipesHandler.chunkSearchedRecipes(recipes);
  };

  // Handle common recipe error
  handleRecipeError = (error, progressContainer, errorTextContainer) => {
    this.domManager.app[progressContainer].classList = "d-none";
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-hidden text-left mt-3";
    this.domManager.app.searchRecipesDownloadText.classList = "d-none";
    this.domManager.app[errorTextContainer].classList = "text-center mt-3";

    this.toggleInputs(false);

    if (error.status === 402) {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "The Spoonacular API has reached its daily quota for this app's current API Key. Please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a>, thank you.";
    } else if (error.statusText === "timeout") {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "The ajax request to the Spoonacular API has timed out, please try again.";
    } else {
      this.domManager.app.spoonacularSearchError.innerHTML =
        "There is a CORS issue with the Spoonacular's API.  This issue will usually resolve itself in ten minutes.  If it does not, please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a >, thank you.";
    }
  };

  // GET favorite recipes from Spoonacular's API
  getFavoriteRecipes() {
    this.clearFavoriteRecipesContainer();

    if (!this.isFavoritesStored()) {
      this.showEmptyFavoriteText();
      return;
    }

    this.showFavoriteRecipesSection();

    const spoonacularAPIKey =
      this.appStateManager.getState("spoonacularAPIKey");
    const favoriteArray = this.appStateManager
      .getState("favoriteArray")
      .join(",");
    const spoonacularURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${favoriteArray}&apiKey=${spoonacularAPIKey}&includeNutrition=true&size=636x393`;

    $.ajax({
      method: "GET",
      url: spoonacularURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      error: this.onGetFavoriteRecipesError,
      success: this.onGetFavoriteRecipesSuccess,
    });
  }

  onGetFavoriteRecipesSuccess = (recipes) => {
    this.recipesHandler.displayFavoriteRecipes(recipes);
  };

  onGetFavoriteRecipesError = (error) => {
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
  };

  // Helper methods for favorite recipes
  clearFavoriteRecipesContainer() {
    while (this.favoriteRecipesContainer.firstChild) {
      this.favoriteRecipesContainer.removeChild(
        this.favoriteRecipesContainer.firstChild
      );
    }
  }

  isFavoritesStored() {
    return (
      localStorage.getItem("favoriteArray") &&
      localStorage.getItem("favoriteArray") !== "[]"
    );
  }

  showEmptyFavoriteText() {
    this.domManager.app.emptyFavoriteTextContainer.classList =
      "d-flex justify-content-center";
  }

  showFavoriteRecipesSection() {
    this.domManager.app.favoriteRecipesSection.classList =
      "favorite-recipes-visible d-flex flex-column justify-content-center";
    this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-visible mt-3";
    this.domManager.app.favoriteRecipesStatusText.classList = "text-center";
  }
}
