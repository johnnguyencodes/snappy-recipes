document.getElementById('file_input_form').addEventListener('change', function (e) {
  var fileName = document.getElementById("file_input_form").files[0].name;
  if (fileName) {
    document.getElementById("file_input_form").disabled = true;
  }
  document.getElementById("custom_file_label").textContent = fileName;
})

function openDietMenu() {
  event.preventDefault();
  document.getElementById("diet_menu").className = "diet-menu-visible d-flex flex-column justify-content-center";
}

function closeDietMenu() {
  event.preventDefault();
  document.getElementById("diet_menu").className = "diet-menu-hidden d-flex flex-column justify-content-center"
}
function imgValidation(event) {
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
  startImgurAPI(formData);
  fileInput.value = "";
}

function resetFields() {
  event.preventDefault();
  const inputs = document.querySelectorAll(".input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = false;
  }
  document.getElementById("file_input_form").value = "";
  document.getElementById("custom_file_label").textContent = "";
  document.getElementById("title").remove();
  document.getElementById("recipe_search_input").value = "";
  document.getElementById("my_image").src="";
  while (document.getElementById("recipe")) {
    document.getElementById("recipe").remove();
  }
}

function search(query) {
  event.preventDefault();
  if (query === "") {
    alert("Error: No search query entered. Please enter a search query.");
    return;
  }
  const inputs = document.querySelectorAll(".input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
  document.getElementById("recipe_download_text").className = "text-center";
  dietInfo();
  startSpoonacularAPI(query);
}


let googleDataToSend = {
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": null
        }
      },
      "features": [
        {
          "type": "LABEL_DETECTION"
        }
      ]
    }
  ]
};

let spoonacularDataToSend = {
  "diet": null,
  "intolerances": null
}

function dietInfo() {
  let restrictionValues = "";
  let intoleranceValues = "";
  var restrictionCheckboxes = document.getElementsByClassName("restrictionCheckbox");
  for (var i = 0; i < restrictionCheckboxes.length; i++) {
    if (restrictionCheckboxes[i].checked) {
      restrictionValues += restrictionCheckboxes[i].value + ", ";
    }
  }
  var intoleranceCheckboxes = document.getElementsByClassName("intoleranceCheckbox");
  for (var j = 0; j < intoleranceCheckboxes.length; j++) {
    if (intoleranceCheckboxes[j].checked) {
      intoleranceValues += intoleranceCheckboxes[j].value + ", ";
    }
  }
  spoonacularDataToSend.diet = restrictionValues.slice(0, -2)
  spoonacularDataToSend.intolerances = intoleranceValues.slice(0, -2);
}

//POST request to IMGUR with image id supplied
function startImgurAPI(formData) {
  $.ajax({
  method: "POST",
  url: "https://api.imgur.com/3/image/",
  data: formData,
  processData: false,
  contentType: false,
  cache: false,
  headers: {
    "Authorization": "Client-ID 62cbd49ff79d018"
    },
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            $('#upload_progress').css({
              width: percentComplete * 100 + '%'
            });
            if (percentComplete > 0 && percentComplete < 1) {
              $('#image_upload_container').removeClass('d-none');
            }
            if (percentComplete === 1) {
              $('#image_upload_container').addClass('d-none');
            }
          }
        }, false);
        return xhr;
      },
  success: function(data) {
    const imageURL = data.data.link;
    googleDataToSend.requests[0].image.source.imageUri = imageURL;
    imageOnPage(imageURL);
    startGoogleAPI();
  },
  error: function(err) {
    console.log(err)
  }
  })
}

//POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
function startGoogleAPI() {
  document.getElementById("title_download_text").className = "text-center";
  $.ajax({
    url: "https://vision.googleapis.com/v1/images:annotate?fields=responses&key=AIzaSyAJzv7ThEspgv8_BxX2EwCs8PUEJMtJN6c",
    type: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(googleDataToSend),
    success: function (response) {
      if (!(response.responses[0].labelAnnotations)) {
        alert("Sorry, your image could not be recognized. Please upload a different image or enter a search");
        document.getElementById("my_image").src = "";
        return;
      }
      const imageTitle = response.responses[0].labelAnnotations[0].description;
      imageTitleOnPage(imageTitle);
      document.getElementById("title_download_text").className = "text-center d-none";
      startSpoonacularAPI(imageTitle);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//GET request to Spoonacular's API with label from Google to get a list of up to 10 recipes containing the item from the image and other nutrition info.
function startSpoonacularAPI(imageTitle) {
  document.getElementById("recipe_download_text").className = "text-center";
  var spoonacularURL = "https://api.spoonacular.com/recipes/complexSearch?query=" + imageTitle + "&apiKey=5d83fe3f2cf14616a6ea74137c2be564&addRecipeNutrition=true"
  $.ajax({
    method: "GET",
    url: spoonacularURL,
    data: spoonacularDataToSend,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(data) {
      recipeOnPage(data);
    },
    error: function(err) {
      console.log(err);
    }
  })
}

function imageOnPage(imageURL) {
  let imageURLParameter = imageURL;
  let imageLoader = {};
  imageLoader['LoadImage'] = function (imageURLParameter, progressUpdateCallback) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', imageURL, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(e) {
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
      xhr.onloadend = function() {
        var options = {};
        var headers = xhr.getAllResponseHeaders();
        var typeMatch = headers.match(/^Content-Type:\s*(.*?)$/mi);

        if(typeMatch && typeMatch[1]){
          options.type = typeMatch[1];
        }

        var blob = new Blob([this.response], options);
        resolve(window.URL.createObjectURL(blob));
      }
      xhr.send();
    });

  }
  imageLoaderFunction(imageLoader, imageURLParameter);
}

function imageLoaderFunction(imageLoader, imageURL) {
  let my_image = document.getElementById("my_image");
  let downloadProgress = document.getElementById("download-progress");
  imageLoader.LoadImage("imageURL")
    .then(image => {
      my_image.src = imageURL;
    })
}

function imageTitleOnPage(imageTitle) {
  const titleContainer = document.getElementById("title_container");
  const h1 = document.createElement("h1");
  h1.id="title";
  h1.textContent = imageTitle;
  titleContainer.append(h1);
}

function recipeOnPage(recipes) {
  const recipeContainer = document.getElementById("recipes_container");
  for (let i = 0; i < recipes.results.length; i++) {
    const imageURL = recipes.results[i].image;
    const title = recipes.results[i].title;
    const readyInMinutes = recipes.results[i].readyInMinutes;
    const servings = recipes.results[i].servings;
    const recipeURL = recipes.results[i].sourceUrl;
    const healthScore = recipes.results[i].healthScore;
    const caloriesAmount = Math.round(recipes.results[i].nutrition.nutrients[0].amount);
    const proteinAmount = Math.round(recipes.results[i].nutrition.nutrients[8].amount);
    const fatAmount = Math.round(recipes.results[i].nutrition.nutrients[1].amount);
    const carbsAmount = Math.round(recipes.results[i].nutrition.nutrients[3].amount);
    const sodiumAmount = Math.round(recipes.results[i].nutrition.nutrients[7].amount);
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card card mb-5 mx-3 pt-3 col-xs-12";
    recipeCard.id="recipe";
    const anchorTag = document.createElement("a");
    const titleAnchorTag = document.createElement("a");
    anchorTag.href = recipeURL;
    titleAnchorTag.href = recipeURL;
    anchorTag.className = "stretched-link d-flex justify-content-center"
    const img = document.createElement("img");
    img.className = "card-image-top";
    img.src = imageURL;
    img.alt = "Recipe Image"
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = title;
    const cardText1 = document.createElement("div");
    cardText1.className = "card-text";
    const minutesSpan = document.createElement("span");
    minutesSpan.className = "badge badge-dark mr-1 mb-1";
    minutesSpan.textContent = `${readyInMinutes} Minutes`;
    const servingsSpan = document.createElement("span");
    servingsSpan.className = "badge badge-dark mb-1";
    servingsSpan.textContent = `${servings} Servings`;
    cardText1.append(minutesSpan);
    cardText1.append(servingsSpan);
    const cardText2 = document.createElement("div");
    cardText2.className = "card-text d-flex flex-wrap";
    const calorieSpan = document.createElement("span");
    calorieSpan.className = "badge badge-secondary mb-1 mr-1"
    calorieSpan.textContent = `${caloriesAmount} Calories`
    const carbsSpan = document.createElement("span");
    carbsSpan.className = "badge badge-secondary mb-1 mr-1"
    carbsSpan.textContent = `${carbsAmount}g Carbs`
    const fatSpan = document.createElement("span");
    fatSpan.className = "badge badge-secondary mb-1 mr-1"
    fatSpan.textContent = `${fatAmount}g Total Fat`
    const proteinSpan = document.createElement("span");
    proteinSpan.className = "badge badge-secondary mb-1 mr-1";
    proteinSpan.textContent = `${proteinAmount}g Protein`
    const sodiumSpan = document.createElement("span");
    sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
    sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
    const cardText3 = document.createElement("div");
    cardText3.className = "card=text d-flex flex-wrap";
    if (recipes.results[i].diets) {
      for (var j = 0; j < recipes.results[i].diets.length; j++) {
        const dietSpan = document.createElement("span");
        dietSpan.className = "badge badge-light mb-1 mr-1";
        dietSpan.textContent = recipes.results[i].diets[j];
        cardText3.append(dietSpan);
      }
    }
    cardText2.append(calorieSpan);
    cardText2.append(carbsSpan);
    cardText2.append(fatSpan);
    cardText2.append(proteinSpan);
    cardText2.append(sodiumSpan);
    cardTitle.append(recipeTitle);
    cardTitle.append(cardText1);
    cardTitle.append(cardText3);
    cardTitle.append(cardText2);
    cardBody.append(cardTitle);
    anchorTag.append(img);
    recipeCard.append(anchorTag);
    recipeCard.append(cardBody);
    recipeContainer.append(recipeCard);
  }
  document.getElementById("recipe_download_text").className = "text-center d-none";
}
