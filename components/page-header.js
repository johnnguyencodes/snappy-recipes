class PageHeader {
  constructor() {
    uploadButton.addEventListener("click", this.imgValidation.bind(this));
    searchButton.addEventListener("click", this.search.bind(this));
    fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
    resetButton.addEventListener("click", this.resetFields.bind(this));
    openFavoriteButton.addEventListener("click", this.openFavorites.bind(this));
    closeFavoriteButton.addEventListener("click", this.closeFavorites.bind(this));
  }

  openFavorites() {
    event.preventDefault();
    document.getElementById("favorited_recipes_element").className = "favorited-recipes-visible d-flex flex-column justify-content-center";
  }

  closeFavorites() {
    event.preventDefault();
    document.getElementById("favorited_recipes_element").className = "favorited-recipes-hidden d-flex flex-column justify-content-center";
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
    // recipeDownloadText.className = "text-center";
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
  }

}
