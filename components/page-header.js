let fileInputForm = document.getElementById("file_input_form");
const fileLabel = document.getElementById("custom_file_label");
const title = document.getElementById("title");
const searchInput = document.getElementById("recipe_search_input");
const image = document.getElementById("my_image");
const recipe = document.getElementById("recipe");
const inputs = document.querySelectorAll(".input");
const recipeDownloadText = document.getElementById("recipe_download_text");
const uploadButton = document.getElementById("upload_button");

class PageHeader {
  constructor(headerElement) {
    this.headerElement = headerElement;
    uploadButton.addEventListener("click", this.imgValidation.bind(this));
    fileInputForm.addEventListener("change", this.handleAddImage.bind(this));
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
    dietInfo();
    postImage(formData);
    fileInput.value = "";
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
