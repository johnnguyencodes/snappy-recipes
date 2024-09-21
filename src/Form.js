export class Form {
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
    this.appStateManager.setState("favoriteYPosition", window.scrollY);
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
    this.appStateManager.setState("favoriteYPosition", window.scrollY);
    this.appStateManager.setState(
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
    window.scroll(0, this.appStateManager.getState("favoriteYPosition"));
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
    this.dietInfo();
    formData.append("image", imageFile);
    formData.append("album", this.appStateManager.getState("imgurAlbumID"));
    formData.append("privacy", "public");
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
