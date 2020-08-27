const fileLabel = document.getElementById("custom_file_label");
let fileInputForm = document.getElementById("file_input_form");
const recipeSearchInput = document.getElementById('recipe_search_input');
const resetButton = document.getElementById("reset_button");
const inputs = document.querySelectorAll(".input");
const uploadButton = document.getElementById("upload_button");
const searchButton = document.getElementById("search_button");
const openFavoriteButton = document.getElementById("open_favorites_button");
const closeFavoriteButton = document.getElementById("close_favorite_button");
const mainContent = document.getElementById("main_content");
const errorContainer = document.getElementById("error_container");
const errorNoFile = document.getElementById("error_no_file");
const errorIncorrectFile = document.getElementById("error_incorrect_file");
const errorFileExceedsSize = document.getElementById("error_file_exceeds_size");
const errorNoSearch = document.getElementById("error_no_search");
let yPosition;

class Form {
  constructor() {
    uploadButton.addEventListener("click", this.imgValidation.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
    resetButton.addEventListener("click", this.resetFields.bind(this));
    openFavoriteButton.addEventListener("click", this.openFavorites.bind(this));
    closeFavoriteButton.addEventListener("click", this.closeFavorites.bind(this));
    overlay.addEventListener("click", this.handleOverlayClick.bind(this));
    recipeSearchInput.addEventListener("keyup", this.enterSearch.bind(this));
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

  enterSearch() {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search(event);
    }
  }
  openFavorites() {
    event.preventDefault();
    yPosition = window.scrollY;
    favoriteRecipesSection.className = "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (!(localStorage.getItem('favoriteArray')) || localStorage.getItem('favoriteArray') !== "[]" ) {
      emptyFavoriteTextContainer.className = "d-none";
    }
    mainContent.className="row main-content-right noscroll";
    mainContent.style.top = `-${yPosition}px`;
    formElement.style.top = "0px";
    formElement.className = "ml-3 col-md-6 col-lg-6 col-xl-4 d-flex flex-column align-items-center form-element-left";
    overlay.className = "";
    this.getFavoriteRecipes();
  }

  closeFavorites() {
    event.preventDefault();
    favoriteRecipesSection.className = "favorite-recipes-hidden d-flex flex-column justify-content-center";
    mainContent.className = "row";
    overlay.className = "d-none";
    window.scroll(0, yPosition);
    formElement.className = "ml-3 col-md-6 col-lg-6 col-xl-4 d-flex flex-column align-items-center";
    favoriteRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
    spoonacularFavoriteError.className = "d-none";
  }

  handleOverlayClick() {
    if (favoriteRecipesSection.classList.contains("favorite-recipes-visible")) {
      this.closeFavorites();
    }
  }

  imgValidation(event) {
    event.preventDefault();
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    if (fileInputForm.files[1]) {
      fileInputForm.files.splice(1, 1);
    }
    const imageFile = fileInputForm.files[0];
    if (!(imageFile)) {
      errorContainer.className="col-12 mt-2";
      errorNoFile.className ="text-danger text-center";
      fileInputForm.value = "";
      return;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!(mimeTypes.includes(fileType))) {
      errorContainer.className = "col-12 mt-2";
      errorIncorrectFile.className = "text-danger text-center";
      fileInputForm.value = "";
      return;
    }
    if (imageFile.size > 10485760) {
      errorContainer.className = "col-12 mt-2";
      errorFileExceedsSize.className = "text-danger text-center";
      fileInputForm.value = "";
      return;
    }
    formData.append("image", imageFile);
    this.dietInfo();
    this.postImage(formData);
    fileInputForm.value = "";
  }

  handleAddImage() {
    let fileName = fileInputForm.files[0].name;
    if (fileName) {
      fileInputForm.disabled = true;
    }
    fileLabel.textContent = fileName;
  }

  search(event) {
    event.preventDefault();
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    let query = (recipeSearchInput.value)
    if (query === "") {
      errorContainer.className = "col-12 mt-2";
      errorNoSearch.className = "text-danger text-center";
      return;
    }
    titleContainer.className = "d-none";
    percentageBarContainer.className = "d-none";
    uploadedImageContainer.className = "d-none";
    this.dietInfo();
    this.getRecipes(query);
  }

  resetFields() {
    event.preventDefault();
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }
    fileLabel.textContent = "";
    if (document.getElementById("image_title")) {
      document.getElementById("image_title").remove();
    }
    recipeSearchInput.value = "";
    uploadedImage.src = "";
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    searchRecipesDownloadProgress.className = "recipe-progress-hidden text-left mt-3";
    searchRecipesDownloadText.className = "d-none";
    noSearchRecipesText.className = "d-none";
    emptyFavoriteTextContainer.className = "d-none";
    imageRecognitionFailedText.className = "d-none";
    chunkedRecipeArray = [];
    chunkedRecipeArrayIndex = 0;
    searchResultsQuantityDiv.className="d-none";
    resultsShownQuantityDiv.className = "d-none";
    showMoreButton.className = "btn btn-secondary my-2"
    spoonacularSearchError.className = "d-none";
    titleContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-around";
    percentageBarContainer.className = "col-12 d-flex flex-column justify-content-center my-3";
    uploadedImageContainer.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center my-3";
    errorContainer.className = "d-none";
    errorNoFile.className = "d-none";
    errorIncorrectFile.className = "d-none";
    errorFileExceedsSize.className = "d-none";
    errorNoSearch.className = "d-none";
  }
}
