export class ImageTitleHandler {
  constructor(domManager) {
    this.domManager = domManager;
  }

  postedImageDownloadProgress(imageURL) {
    this.domManager.app.imageProcessingContainer.classList =
      "d-none desktop-space-form";
    let imageURLParameter = imageURL;
    // let imageLoader = {};
    // imageLoader["LoadImage"] = (imageURLParameter, progressUpdateCallback) => {
    //   return new Promise((resolve) => {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("GET", imageURL, true);
    //     xhr.responseType = "arraybuffer";
    //     xhr.onprogress = (progressEvent) => {
    //       if (progressEvent.lengthComputable) {
    //         let percentComplete = progressEvent.loaded / progressEvent.total;
    //         $("#percentage_bar_download").css({
    //           width: percentComplete * 100 + "%",
    //         });
    //         if (percentComplete > 0 && percentComplete < 1) {
    //           $("#percentage_download_container").removeClass("d-none");
    //         }
    //         if (percentComplete === 1) {
    //           $("#percentage_download_container").addClass("d-none");
    //           this.domManager.app.percentageBarContainer.classList =
    //             "d-none desktop-space-form";
    //         }
    //       }
    //     };
    //     xhr.onloadend = () => {
    //       const options = {};
    //       const headers = xhr.getAllResponseHeaders();
    //       const typeMatch = headers.match(/^Content-Type:\s*(.*?)$/im);

    //       if (typeMatch && typeMatch[1]) {
    //         options.type = typeMatch[1];
    //       }

    //       const blob = new Blob([this.response], options);
    //       resolve(window.URL.createObjectURL(blob));
    //     };
    //     // xhr.send();
    //   });
    // };
    this.imageLoaderFunction(imageURLParameter);
  }

  imageLoaderFunction(imageURL) {
    console.log("imageURL", imageURL);
    this.domManager.app.uploadedImage.src = imageURL;
  }

  imageTitleOnPage(imageTitle, score) {
    const h2 = document.createElement("h1");
    h2.id = "image_title";
    h2.classList = "text-center";
    h2.textContent = imageTitle;
    this.domManager.app.titleContainer.append(h2);
    const p = document.createElement("p");
    p.id = "title_score";
    p.classList = "text-center";
    const percent = (score * 100).toFixed(2);
    p.textContent = `Confidence: ${percent}%`;
    this.domManager.app.titleContainer.append(p);
    const hr = document.createElement("hr");
    hr.id = "hr";
    hr.classList = "mx-3 my-0 py-0 d-xl-none";
    this.domManager.app.titleContainer.append(hr);
  }
}
