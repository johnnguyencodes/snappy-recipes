const fileLabel = document.getElementById("custom_file_label");
let fileInputForm = document.getElementById("file_input_form");
const recipeSearchInput = document.getElementById('recipe_search_input');
const resetButton = document.getElementById("reset_button");
const searchButton = document.getElementById("search_button");
const toggleFavoritesButton = document.getElementById("toggle_favorites_button");
const toggleDietButton = document.getElementById("toggle_diet_button");
const mainContent = document.getElementById("main_content");
const errorContainer = document.getElementById("error_container");
const errorSpoonacularSearch = document.getElementById("spoonacular_search_error");
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

let favoriteYPosition;
let userInputContainerYPosition;
let rect;

class Form {
  constructor() {
    favoriteRecipesSection.addEventListener("scroll", this.keepUserInputContainerPosition.bind(this));
    openSideMenuButton.addEventListener("click", this.openSideMenu.bind(this));
    closeSideMenuButton.addEventListener("click", this.closeSideMenu.bind(this));
    toggleFavoritesButton.addEventListener("click", this.toggleFavorites.bind(this));
    toggleDietButton.addEventListener("click", this.toggleDiet.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.imgValidation.bind(this));
    overlay.addEventListener("click", this.closeSideMenu.bind(this));
    recipeSearchInput.addEventListener("keyup", this.enterSearch.bind(this));
    fileLabel.addEventListener("dragover", this.imgValidation.bind(this));
    document.addEventListener("drop", function (event) {
      if (event.target !== fileInputForm) {
        event.preventDefault();
      }});
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
    favoriteRecipesSection.className = "d-flex flex-column justify-content-center";
    dietMenu.className = "d-none flex-column justify-content-center";
  }

  toggleDiet() {
    event.preventDefault();
    favoriteRecipesSection.className = "d-none flex-column justify-content-center";
    dietMenu.className = "d-flex flex-column justify-content-center";
  }

  openFavorites() {
    event.preventDefault();
    favoriteYPosition = window.scrollY;
    favoriteRecipesSection.className = "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (!(localStorage.getItem('favoriteArray')) || localStorage.getItem('favoriteArray') !== "[]" ) {
      emptyFavoriteTextContainer.className = "d-none";
    }
    mainContent.className="row main-content-right noscroll";
    mainContent.style.top = `-${favoriteYPosition}px`;
    formElement.style.top = "0px";
    formElement.className = "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    overlay.className = "";
    this.getFavoriteRecipes();
  }

  closeFavorites() {
    event.preventDefault();
    favoriteRecipesSection.className = "favorite-recipes-hidden d-flex flex-column justify-content-center";
    mainContent.className = "row";
    overlay.className = "d-none";
    window.scroll(0, favoriteYPosition);
    formElement.className = "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    favoriteRecipesDownloadProgress.className = "recipe-progress-hidden mt-3 text-center";
    spoonacularFavoriteError.className = "d-none";
    spoonacularFavoriteTimeoutError.className = "d-none";
  }

  openSideMenu() {
    event.preventDefault();
    favoriteYPosition = window.scrollY;
    rect = userInputContainer.getBoundingClientRect();
    closeSideMenuButton.className = "close-side-menu-button-visible d-flex justify-content-center align-items-center text-danger p-0 m-0";
    toggleFavoritesButton.className = "toggle-visible toggle btn btn-danger text-white m-0 p-0 d-flex justify-content-center align-items-center"
    toggleDietButton.className = "toggle-visible toggle btn btn-primary text-white m-0 p-0 d-flex justify-content-center align-items-center";
    sideMenuContainer.className = "side-menu-visible d-flex flex-column justify-content-center";
    favoriteRecipesSection.className = "d-flex flex-column justify-content-center";
    dietMenu.className = "d-none flex-column justify-content-center";
    mainContent.className = "row main-content-right noscroll";
    overlay.className = "";
    mainContent.style.top = `-${favoriteYPosition}px`;
    headerElement.className = "d-flex flex-column align-items-center justify-content-center my-2 px-0";
    formElement.style.top = "0px";
    formElement.className = "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left";
    userInputContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0"
    mainContent.style.top = `-${favoriteYPosition}px`;
    this.getFavoriteRecipes();
  }

    keepUserInputContainerPosition() {
        console.log("rect", rect);
        console.log("scrollY", userInputContainer.scrollY);
    if (document.getElementById("side_menu_container").classList.contains("side-menu-visible") && document.getElementById("diet_menu").classList.contains("d-none")) {
      userInputContainer.scrollY = rect.top;
    } else return;
  }

  closeSideMenu() {
    event.preventDefault();
    closeSideMenuButton.className = "close-side-menu-button-hidden d-flex justify-content-center align-items-center text-danger p-0 m-0";
    toggleFavoritesButton.className = "toggle-hidden toggle btn btn-danger text-white m-0 p-0 d-flex justify-content-center align-items-center"
    toggleDietButton.className = "toggle-hidden toggle btn btn-primary text-white m-0 p-0 d-flex justify-content-center align-items-center";
    sideMenuContainer.className = "side-menu-hidden d-flex flex-column justify-content-center";
    mainContent.className = "row";
    overlay.className = "d-none";
    window.scroll(0, favoriteYPosition);
    formElement.className = "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center";
    headerElement.className = "static d-flex flex-column align-items-center justify-content-center my-2 px-0";
    favoriteRecipesDownloadProgress.className = "favorite-recipe-progress-hidden mt-3 text-center";
    spoonacularFavoriteError.className = "d-none";
    spoonacularFavoriteTimeoutError.className = "d-none";
    userInputContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0";
    this.dietInfo();
  }

  imgValidation(event) {
    event.preventDefault();
    if (!(fileInputForm.files[0])) {
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
    percentageBarContainer.className = "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
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
    titleContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-around flex-column desktop-space-form mb-3";
    percentageBarContainer.className = "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form";
    uploadedImageContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center my-3 desktop-space-form";
    if (fileInputForm.files[1]) {
      fileInputForm.files.splice(1, 1);
    }
    const imageFile = fileInputForm.files[0];
    if (!(imageFile)) {
      errorContainer.className="col-12 mt-2 desktop-space-form";
      errorNoFile.className ="text-danger text-center";
      fileInputForm.value = "";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!(mimeTypes.includes(fileType))) {
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
    let query = (recipeSearchInput.value)
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
