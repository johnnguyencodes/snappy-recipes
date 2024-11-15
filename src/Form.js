export class Form {
  constructor(domManager, appStateManager) {
    this.domManager = domManager;
    this.appStateManager = appStateManager;

    this.initEventListeners();
  }

  // Initialize all event listeners
  initEventListeners() {
    const { form, app } = this.domManager;

    app.favoriteRecipesSection.addEventListener(
      "scroll",
      this.keepUserInputContainerPosition
    );

    form.openSideMenuButton.addEventListener("click", this.openSideMenu);
    form.closeSideMenuButton.addEventListener("click", this.closeSideMenu);
    form.toggleFavoritesButton.addEventListener("click", this.toggleFavorites);
    form.toggleDietButton.addEventListener("click", this.toggleDiet);
    form.searchButton.addEventListener("click", this.search);
    form.fileInputForm.addEventListener("change", this.imgValidation);
    form.recipeSearchInput.addEventListener("keyup", this.enterSearch);
    form.fileLabel.addEventListener("dragover", this.imgValidation);
    document.addEventListener("drop", function (event) {
      if (event.target.id !== "file_input_form") {
        event.preventDefault();
      }
    });

    // Close side menu when clicking on overlay
    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", this.closeSideMenu);
  }

  // Methods to register external event handlers from app.js
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

  // Event handlers
  enterSearch = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search(event);
    }
  };

  toggleFavorites = (event) => {
    event.preventDefault();
    console.log("toggle favorites");
    const { app, form } = this.domManager;

    app.favoriteRecipesSection.classList.remove("d-none");
    app.favoriteRecipesSection.classList.add("d-flex");
    app.dietMenu.classList.add("d-none");
    app.dietMenu.classList.remove("d-flex");
    form.toggleFavoritesButton.classList.add("font-weight-bold");
    form.toggleDietButton.classList.remove("font-weight-bold");
  };

  toggleDiet = (event) => {
    event.preventDefault();
    console.log("toggle diet");
    const { app, form } = this.domManager;

    app.favoriteRecipesSection.classList.add("d-none");
    app.favoriteRecipesSection.classList.remove("d-flex");
    app.dietMenu.classList.remove("d-none");
    app.dietMenu.classList.add("d-flex");
    form.toggleFavoritesButton.classList.remove("font-weight-bold");
    form.toggleDietButton.classList.add("font-weight-bold");
  };

  openSideMenu = (event) => {
    event.preventDefault();

    const { form, app } = this.domManager;
    this.appStateManager.setState("favoriteYPosition", window.scrollY);
    this.appStateManager.setState(
      "rect",
      this.domManager.form.userInputContainer.getBoundingClientRect()
    );

    form.closeSideMenuButton.classList.remove("close-side-menu-button-hidden");
    form.closeSideMenuButton.classList.add("close-side-menu-button-visible");

    form.toggleFavoritesButton.classList.remove("favorites-toggle-hidden");
    form.toggleFavoritesButton.classList.add("favorites-toggle-visible");

    form.toggleDietButton.classList.remove("diet-toggle-hidden");
    form.toggleDietButton.classList.add("diet-toggle-visible");

    form.favoriteStickyDiv.classList.add("favorite-sticky-div-visible");
    form.favoriteStickyDiv.classList.remove("favorite-sticky-div-hidden");

    form.sideMenuContainer.classList.remove("side-menu-hidden");
    form.sideMenuContainer.classList.add("side-menu-visible");

    form.mainContent.classList.add("main-content-right", "noscroll");
    overlay.classList.remove("d-none");

    // app.favoriteRecipesSection.classList =
    //   "d-flex flex-column justify-content-center";
    // app.dietMenu.classList =
    //   "d-none flex-column justify-content-center align-items-center";
    form.mainContent.style.top = `-${this.appStateManager.getState("favoriteYPosition")}px`;
    form.headerElement.classList.add("my-2", "px-0");
    app.formElement.style.top = "0px";
    app.formElement.classList.add("form-element-left");
    form.userInputContainer.classList.add("mt-3", "px-0");
    // form.mainContent.style.top = `-${this.appStateManager.getState("favoriteYPosition")}px - 50px`;

    this.getFavoriteRecipes();
  };

  closeSideMenu = (event) => {
    event.preventDefault();
    const { form, app } = this.domManager;
    const overlay = document.getElementById("overlay");

    form.closeSideMenuButton.classList.add("close-side-menu-button-hidden");
    form.closeSideMenuButton.classList.remove("close-side-menu-button-visible");

    form.toggleFavoritesButton.classList.add("favorites-toggle-hidden");
    form.toggleFavoritesButton.classList.remove("favorites-toggle-visible");

    form.toggleDietButton.classList.add("diet-toggle-hidden");
    form.toggleDietButton.classList.remove("diet-toggle-visible");

    form.favoriteStickyDiv.classList.add("favorite-sticky-div-hidden");
    form.favoriteStickyDiv.classList.remove("favorite-sticky-div-visible");

    form.sideMenuContainer.classList.add("side-menu-hidden");
    form.sideMenuContainer.classList.remove("side-menu-visible");

    form.mainContent.classList.remove("main-content-right", "noscroll");
    overlay.classList.add("d-none");

    window.scroll(0, this.appStateManager.getState("favoriteYPosition"));
    app.formElement.classList.remove("form-element-left");
    form.headerElement.classList.remove("my-2", "px-0");
    this.resetErrorMessages();

    // app.favoriteRecipesDownloadProgress.classList =
    //   "favorite-recipe-progress-hidden mt-3 text-center";
    // app.spoonacularFavoriteError.classList = "d-none";
    // app.spoonacularFavoriteTimeoutError.classList = "d-none";
    form.userInputContainer.classList =
      "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    this.dietInfo();
  };

  keepUserInputContainerPosition = () => {
    const { form, app } = this.domManager;

    const sideMenuVisible =
      form.sideMenuContainer.classList.contains("side-menu-visible");
    const dietMenuHidden = app.dietMenu.classList.contains("d-none");

    if (sideMenuVisible && dietMenuHidden) {
      form.userInputContainer.scrollTop =
        this.appStateManager.getState("rect").top;
    }
  };

  imgValidation = (event) => {
    event.preventDefault();
    const { form } = this.domManager;
    const imageFile = form.fileInputForm.files[0];

    if (!imageFile) {
      this.showError("errorNoFile");
      return;
    }

    if (!this.isValidImageType(imageFile.type)) {
      this.showError("errorIncorrectFile");
      return;
    }

    if (imageFile.size > 10485760) {
      // 10MB limit
      this.showError("errorFileExceedsSize");
      return;
    }

    this.disableInputs(true);
    this.resetUIBeforeUpload();

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("album", this.appStateManager.getState("imgurAlbumID"));
    formData.append("privacy", "public");

    this.dietInfo();
    this.postImage(formData);
    form.fileInputForm.value = "";
  };

  search = (event) => {
    event.preventDefault();
    const { form } = this.domManager;

    this.resetUIBeforeSearch();
    this.disableInputs(true);

    const query = form.recipeSearchInput.value.trim();
    this.dietInfo();

    if (!query) {
      this.getRandomRecipes();
      return;
    }

    this.getRecipes(query);
  };

  preventDocumentDrop = (event) => {
    if (event.target.id !== "file_input_form") {
      event.preventDefault();
    }
  };

  // Helper Methods
  isValidImageType(fileType) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(fileType);
  }

  showError(errorType) {
    const { form } = this.domManager;

    this.resetErrorMessages();
    form.errorContainer.classList.remove("d-none");
    form.errorContainer.classList.add("col-12", "mt-2w");
    form[errorType].classList.remove("d-none");
    form[errorType].classList.add("text-danger", "text-center");
    form.fileInputForm.value = "";
    this.disableInputs(false);
  }

  resetErrorMessages() {
    console.log("resetErrorMessages");
    const { form, app } = this.domManager;

    form.errorContainer.classList.add("d-none");
    form.errorNoFile.classList.add("d-none");
    form.errorIncorrectFile.classList.add("d-none");
    form.errorFileExceedsSize.classList.add("d-none");
    form.errorSpoonacularSearch.classList.add("d-none");
    form.errorNoSearchResults.classList.add("d-none");
    form.errorImgurCORSIssue.classList.add("d-none");
    app.spoonacularFavoriteTimeoutError.classList.add("d-none");
  }

  resetUIBeforeUpload() {
    const { app } = this.domManager;

    this.clearRecipes();
    app.percentageBarContainer.classList.remove("d-none");
    app.uploadedImage.src = "";
    app.imageRecognitionFailedText.classList.add("d-none");
    this.resetErrorMessages();
    app.titleContainer.classList.remove("d-none");
    app.uploadedImageContainer.classList.remove("d-none");
  }

  resetUIBeforeSearch() {
    const { app } = this.domManager;

    this.clearRecipes();
    app.searchResultsQuantityDiv.classList.add("d-none");
    app.searchResultsQuantityDiv.classList.remove("d-flex");
    app.resultsShownQuantityDiv.classList.add("d-none");
    app.resultsShownQuantityDiv.classList.remove("d-flex");
    app.imageRecognitionFailedText.classList.add("d-none");
    app.imageRecognitionFailedText.classList.remove("d-flex");
    this.resetErrorMessages();
    app.titleContainer.classList.add("d-none");
    app.percentageBarContainer.classList.add("d-none");
    app.uploadedImageContainer.classList.add("d-none");
  }

  clearRecipes() {
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    ["image_title", "title_score", "hr"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  }

  disableInputs(isDisabled) {
    const inputs = this.domManager.app.inputs;
    inputs.forEach((input) => {
      input.disabled = isDisabled;
      input.classList.toggle("no-click", isDisabled);
    });
  }
}
