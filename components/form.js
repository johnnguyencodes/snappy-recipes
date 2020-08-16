const favoriteRecipesSection = document.getElementById("favorite_recipes_section");

class Form {
  constructor() {
    uploadButton.addEventListener("click", this.imgValidation.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
    resetButton.addEventListener("click", this.resetFields.bind(this));
    openFavoriteButton.addEventListener("click", this.openFavorites.bind(this));
    closeFavoriteButton.addEventListener("click", this.closeFavorites.bind(this));
    this.favoriteCheck = this.favoriteCheck.bind(this);
    document.getElementById("overlay").addEventListener("click", this.handleOverlayClick.bind(this));
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

  handleOverlayClick() {
    if (favoriteRecipesSection.className === "favorite-recipes-visible d-flex flex-column justify-content-center") {
      this.closeFavorites();
    }
  }

  openFavorites() {
    event.preventDefault();
    favoriteRecipesSection.className = "favorite-recipes-visible d-flex flex-column justify-content-center";
    if (localStorage.getItem('favoriteArray') !== null ) {
      document.getElementById("empty_favorite_text").className = "d-none";
    }
    document.getElementById("content").className="row noscroll";
    document.getElementById("overlay").className = "";
  }


  closeFavorites() {
    event.preventDefault();
    this.favoriteCheck();
    window.scrollTo({
      top: 0,
      behavior: "auto"
    })
    favoriteRecipesSection.className = "favorite-recipes-hidden d-flex flex-column justify-content-center";
    document.getElementById("content").className = "row";
    document.getElementById("overlay").className = "d-none";

  }

  favoriteCheck() {
    if (!(localStorage.getItem('favoriteArray'))) {
      return;
    }
    let searchedArray = document.querySelectorAll("#heart_container i");
    let favoriteArrayToCheck = JSON.parse(localStorage.getItem("favoriteArray"));
    for (var i = 0; i < searchedArray.length; i++) {
      if (favoriteArrayToCheck.includes(parseInt(searchedArray[i].id.substring(11)))) {
        searchedArray[i].className = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        searchedArray[i].className = "far fa-heart text-danger heart-icon fa-lg";
      }
    }
  }

  imgValidation(event) {
    event.preventDefault();
    const fileInput = document.getElementById("file_input_form");
    if (fileInput.files[1]) {
      fileInput.files.splice(1, 1);
    }
    const imageFile = fileInput.files[0];
    if (!(imageFile)) {
      alert("Error: No file selected, please select a file to upload.");
      fileInput.value = "";
      return;
    }
    const inputs = document.querySelectorAll(".input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    const fileType = imageFile.type;
    const formData = new FormData();
    const mimeTypes = ['image/jpg', 'image/png', 'image/gif'];
    if (!(mimeTypes.indexOf(fileType))) {
      alert("Error: Incorrect file type, please select a jpeg, png or gif file.");
      fileInput.value = "";
      return;
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      alert("Error: Image exceeds 10MB size limit");
      fileInput.value = "";
      return;
    }
    formData.append("image", imageFile);
    this.dietInfo();
    this.postImage(formData);
    fileInput.value = "";
  }

  handleAddImage() {
    let fileName = document.getElementById("file_input_form").files[0].name;
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
    this.dietInfo();
    this.getRecipes(query);
  }

  resetFields() {
    event.preventDefault();
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }
    fileLabel.textContent = "";
    if (document.getElementById("title")) {
      document.getElementById("title").remove();
    }
    searchInput.value = "";
    image.src = "";
    while (document.getElementById("recipe")) {
      document.getElementById("recipe").remove();
    }
    document.getElementById("recipe_download_text").className = "text-center d-none";
    document.getElementById("no_recipes_text").className = "text-center d-none";
    document.getElementById("image_not_recognized_text").className = "text-center d-none";
    chunked = [];
    chunkedIncrementor = 0;
    document.getElementById("search_results_quantity_div").className="d-none";
    document.getElementById("results_quantity_container").className = "d-none";
    document.getElementById("show_more_button").className = "btn btn-secondary"
  }

}
