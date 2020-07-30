class ImageTitleContainer {
  constructor(imageContainer, titleContainer) {
    this.imageContainer = imageContainer;
    this.titleContainer = titleContainer;
    this.imageLoaderFunction = this.imageLoaderFunction.bind(this);
  }

  imageOnPage(imageURL) {
    let imageURLParameter = imageURL;
    let imageLoader = {};
    imageLoader['LoadImage'] = function (imageURLParameter, progressUpdateCallback) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function (e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            $('#download_progress').css({
              width: percentComplete * 100 + '%'
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $("#image_download_container").removeClass("d-none");
            }
            if (percentComplete === 1) {
              $("#image_download_container").addClass("d-none");
            }
          }
        };
        xhr.onloadend = function () {
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
    let my_image = document.getElementById("my_image");
    let downloadProgress = document.getElementById("download-progress");
    imageLoader.LoadImage("imageURL")
      .then(image => {
        my_image.src = imageURL;
      })
  }

  imageTitleOnPage(imageTitle) {
    const titleContainer = document.getElementById("title_container");
    const h1 = document.createElement("h1");
    h1.id = "title";
    h1.textContent = imageTitle;
    titleContainer.append(h1);
  }

}
