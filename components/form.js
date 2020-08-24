const favoriteRecipesSection = document.getElementById("favorite_recipes_section");
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
    favoriteRecipesSection.className = "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (!(localStorage.getItem('favoriteArray')) || localStorage.getItem('favoriteArray') !== "[]" ) {
      emptyFavoriteTextContainer.className = "d-none";
    }
    mainContent.className="row noscroll";
    overlay.className = "";
    this.getFavoriteRecipes();
  }

  closeFavorites() {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "auto"
    })
    favoriteRecipesSection.className = "favorite-recipes-hidden d-flex flex-column justify-content-center";
    mainContent.className = "row";
    overlay.className = "d-none";
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
    if (fileInputForm.files[1]) {
      fileInputForm.files.splice(1, 1);
    }
    const imageFile = fileInputForm.files[0];
    if (!(imageFile)) {
      alert("Error: No file selected, please select a file to upload.");
      fileInputForm.value = "";
      return;
    }
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ['image/jpg', 'image/png', 'image/gif'];
    if (!(mimeTypes.indexOf(fileType))) {
      alert("Error: Incorrect file type, please select a jpeg, png or gif file.");
      fileInputForm.value = "";
      return;
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      alert("Error: Image exceeds 10MB size limit");
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
    let query = (recipeSearchInput.value)
    if (query === "") {
      alert("Error: No search query entered. Please enter a search query.");
      return;
    }
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
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
  }
}
