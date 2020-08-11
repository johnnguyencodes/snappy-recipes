const favoritedRecipesElement = document.getElementById("favorited_recipes_element");

class PageHeader {
  constructor() {
    uploadButton.addEventListener("click", this.imgValidation.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
    resetButton.addEventListener("click", this.resetFields.bind(this));
    openFavoriteButton.addEventListener("click", this.openFavorites.bind(this));
    closeFavoriteButton.addEventListener("click", this.closeFavorites.bind(this));
    this.favoriteCheck = this.favoriteCheck.bind(this);
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

  openFavorites() {
    event.preventDefault();
    favoritedRecipesElement.className = "favorited-recipes-visible d-flex flex-column justify-content-center";
    if (localStorage.getItem('favoritedArray') !== "[]") {
      document.getElementById("empty_favorite_text").className = "d-none";
    }
    document.getElementById("content").className="noscroll";
  }


  closeFavorites() {
    event.preventDefault();
    this.favoriteCheck();
    window.scrollTo({
      top: 0,
      behavior: "auto"
    })
    favoritedRecipesElement.className = "favorited-recipes-hidden d-flex flex-column justify-content-center";
    document.getElementById("content").className = "";

  }

  favoriteCheck() {
    let searchedArray = document.querySelectorAll("#heart_container i");
    let favoritedArrayToCheck = JSON.parse(localStorage.getItem("favoritedArray"));
    for (var i = 0; i < searchedArray.length; i++) {
      if (favoritedArrayToCheck.includes(parseInt(searchedArray[i].id.substring(11)))) {
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
      fileInputForm = true;
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
    document.getElementById("no_recipes_text").className = "text-center d-none";
    document.getElementById("image_not_recognized_text").className = "text-center d-none";

  }

}
