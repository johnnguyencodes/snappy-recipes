class ImageTitleHandler {
  constructor() {
  }

  postedImageDownloadProgress(imageURL) {
    imageProcessingContainer.className = "d-none desktop-space-form";
    let imageURLParameter = imageURL;
    let imageLoader = {};
    imageLoader['LoadImage'] = (imageURLParameter, progressUpdateCallback) => {
      return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            var percentComplete = progressEvent.loaded / progressEvent.total;
            $('#percentage_bar_download').css({
              width: percentComplete * 100 + '%'
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $("#percentage_download_container").removeClass("d-none");
            }
            if (percentComplete === 1) {
              $("#percentage_download_container").addClass("d-none");
              percentageBarContainer.className = "d-none desktop-space-form";
            }
          }
        };
        xhr.onloadend = () => {
          var options = {};
          var headers = xhr.getAllResponseHeaders();
          var typeMatch = headers.match(/^Content-Type:\s*(.*?)$/mi);

          if (typeMatch && typeMatch[1]) {
            options.type = typeMatch[1];
          }

          var blob = new Blob([this.response], options);
          resolve(window.URL.createObjectURL(blob));
        }
        xhr.send();
      });

    }
    this.imageLoaderFunction(imageLoader, imageURLParameter);
  }

  imageLoaderFunction(imageLoader, imageURL) {
    imageLoader.LoadImage("imageURL")
      .then(image => {
        uploadedImage.src = imageURL;
      })
  }

  imageTitleOnPage(imageTitle, score) {
    const h2 = document.createElement("h1");
    h2.id = "image_title";
    h2.className = "text-center";
    h2.textContent = imageTitle;
    titleContainer.append(h2);
    const p = document.createElement("p");
    p.id = "title_score";
    p.className = "text-center";
    const percent = (score * 100).toFixed(2);
    p.textContent = `Confidence: ${percent}%`;
    titleContainer.append(p);
  }
}
