const fileInputForm = document.getElementById("file_input_form");
const fileLabel = document.getElementById("custom_file_label");
const title = document.getElementById("title");
const searchInput = document.getElementById("recipe_search_input");
const image = document.getElementById("my_image");
const recipe = document.getElementById("recipe");
const inputs = document.querySelectorAll(".input");
const recipeDownloadText = document.getElementById("recipe_download_text");

class PageHeader {
  constructor(headerElement) {
    this.headerElement = headerElement;
    this.fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
  }

  handleAddImage() {
    let fileName = document.getElementById("file_input_form").files[0].name;
    if (fileName) {
      fileInputForm = true;
    }
    fileLabel.textContent = fileName;
  }

  search(query) {
    event.preventDefault();
    if (query === "") {
      alert("Error: No search query entered. Please enter a search query.");
      return;
    }
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    recipeDownloadText.className = "text-center";
    dietInfo();
    getRecipes(query);
  }

  resetFields() {
    event.preventDefault();
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }
    fileInputForm.value = "";
    fileLabel.textContent = "";
    if (title) {
      title.remove();
    }
    searchInput.value = "";
    image.src = "";
    while (recipe) {
      recipe.remove();
    }
  }

}
