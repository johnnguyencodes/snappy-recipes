export class ImageTitleHandler {
  constructor(domManager) {
    this.domManager = domManager;
  }

  postedImageDownloadProgress(imageURL) {
    this.domManager.app.imageProcessingContainer.classList =
      "d-none desktop-space-form";

    // Load the image onto the uploadedImage element
    this.loadImage(imageURL);
  }

  // Load the image by setting the src attribute
  loadImage(imageURL) {
    this.domManager.app.uploadedImage.src = imageURL;
  }

  // Display the image title and confidence score on the page
  displayImageTitle(imageTitle, score) {
    const { titleContainer } = this.domManager.app;

    // Clear any previous content
    titleContainer.innerHTML = "";

    // Create the image title element
    const titleElement = document.createElement("h2");
    titleElement.id = "image_title";
    titleElement.classList.add("text-center");
    titleElement.textContent = imageTitle;

    // Create the confidence score element
    const scoreElement = document.createElement("p");
    scoreElement.id = "title_score";
    scoreElement.classList.add("text-center");
    const percent = (score * 100).toFixed(2);
    scoreElement.textContent = `Confidence: ${percent}%`;

    // Create the hr element
    const hrElement = document.createElement("hr");
    hrElement.id = "hr";
    hrElement.classList = "mx-3 my-0 py-0 d-xl-none";

    // Append elements to the title container
    titleContainer.append(titleElement, scoreElement, hrElement);
  }
}
