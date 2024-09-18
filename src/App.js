export class App {
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
    this.refreshAccessToken(this.appStateManager.getState("imgurRefreshToken"));
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
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]); // Logs each key-value pair in the FormData object
    }
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
      this.appStateManager.updateState("imgurAccessToken", data.access_token);
      console.log(
        "New access token:",
        this.appStateManager.getState("imgurAccessToken")
      );
    } else {
      console.error("Error refreshing token:", data);
    }
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
