class ImageTitleHandler {
  constructor() {
  }

  postedImageDownloadProgress(imageURL) {
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

  imageTitleOnPage(imageTitle) {
    const h1 = document.createElement("h1");
    h1.id = "image_title";
    h1.textContent = imageTitle;
    titleContainer.append(h1);
  }
}
