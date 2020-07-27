//global variables
let imgurAPIKey = config.imgurAPIKey;
let googleAPIKey = config.googleAPIKey;
let spoonacularAPIKey = config.spoonacularAPIKey;
const fileInputForm = document.getElementById("file_input_form");
let customFileLabel = document.getElementById("custom_file_label");
const dietMenu = document.getElementById("diet_menu");
const inputs = document.querySelectorAll(".input");
const recipeSearchInput = document.getElementById("recipe_search_input");
const myImage = document.getElementById("my_image");
const recipeDownloadIndicator = document.getElementById("recipe_download_text");
const imageRecognitionIndicator = document.getElementById("title_download_text");

// input forms
fileInputForm.addEventListener('change', function (e) {
  var fileName = document.getElementById("file_input_form").files[0].name;
  if (fileName) {
    fileInputForm.disabled = true;
  }
  customFileLabel.textContent = fileName;
})

function openDietMenu() {
  event.preventDefault();
  dietMenu.className = 'diet-menu-visible d-flex flex-column justify-content-center';
}

function closeDietMenu() {
  event.preventDefault();
  dietMenu.className = 'diet-menu-hidden';
}

function imgValidation(event) {
  event.preventDefault();
  if (fileInputForm.files[1]) {
    fileInputForm.files.splice(1, 1);
  }
  const imageFile = fileInputForm.files[0];
  if (!(imageFile)) {
    alert('Error: No file selected, please select a file to upload.');
    fileInputForm.value = '';
    return;
  }
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
  const fileType = imageFile.type;
  const formData = new FormData();
  const mimeTypes = ['image/jpg', 'image/png', 'image/gif'];
  if (!(mimeTypes.indexOf(fileType))) {
    alert('Error: Incorrect file type, please select a jpeg, png or gif file.');
    fileInputForm.value = '';
    return;
  }
  if (imageFile.size > 10 * 1024 * 1024) {
    alert('Error: Image exceeds 10MB size limit');
    fileInputForm.value = '';
    return;
  }
  formData.append('image', imageFile);
  dietInfo();
  postImage(formData);
  fileInputForm.value = '';
}

function resetFields() {
  const imageTitle = document.getElementById("title");
  const recipe = document.getElementById("recipe");
  event.preventDefault();
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = false;
  }
  fileInputForm.value = '';
  customFileLabel.textContent = '';
  if (imageTitle) {
    imageTitle.remove();
  }
  recipeSearchInput.value = '';
  myImage.src = '';
  while (document.getElementById("recipe")) {
    document.getElementById("recipe").remove();
  }
}

function search(query) {
  event.preventDefault();
  if (query === '') {
    alert('Error: No search query entered. Please enter a search query.');
    return;
  }
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
  recipeDownloadIndicator.className = 'text-center';
  dietInfo();
  getRecipes(query);
}

function dietInfo() {
  let restrictionValues = '';
  let intoleranceValues = '';
  let restrictionCheckboxes = document.getElementsByClassName('restrictionCheckbox');
  for (var i = 0; i < restrictionCheckboxes.length; i++) {
    if (restrictionCheckboxes[i].checked) {
      restrictionValues += restrictionCheckboxes[i].value + ', ';
    }
  }
  let intoleranceCheckboxes = document.getElementsByClassName('intoleranceCheckbox');
  for (var j = 0; j < intoleranceCheckboxes.length; j++) {
    if (intoleranceCheckboxes[j].checked) {
      intoleranceValues += intoleranceCheckboxes[j].value + ', ';
    }
  }
  dataForGetRecipe.diet = restrictionValues.slice(0, -2);
  dataForGetRecipe.intolerances = intoleranceValues.slice(0, -2);
}

// POST request to IMGUR with image id supplied
function postImage(formData) {
  $.ajax({
    method: 'POST',
    url: 'https://api.imgur.com/3/image/',
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    headers: {
      Authorization: imgurAPIKey
    },
    xhr: function () {
      let xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener('progress', function (evt) {
        if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
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
    success: function (data) {
      const imageURL = data.data.link;
      dataForImageRecognition.requests[0].image.source.imageUri = imageURL;
      displayImage(imageURL);
      imageRecognition();
    },
    error: function (err) {
      console.log(err);
    }
  });
}

const dataForImageRecognition = {
  requests: [
    {
      image: {
        source: {
          imageUri: null
        }
      },
      features: [
        {
          type: 'LABEL_DETECTION'
        }
      ]
    }
  ]
};

// POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
function imageRecognition() {
  imageRecognitionIndicator.className = 'text-center';
  $.ajax({
    url: `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${googleAPIKey}`,
    type: 'POST',
    dataType: 'JSON',
    contentType: 'application/json',
    data: JSON.stringify(dataForImageRecognition),
    success: function (response) {
      if (!(response.responses[0].labelAnnotations)) {
        alert('Sorry, your image could not be recognized. Please upload a different image or enter a search');
        myImage.src = '';
        return;
      }
      const recognizedImageLabel = response.responses[0].labelAnnotations[0].description;
      displayImageTitle(recognizedImageLabel);
      imageRecognitionIndicator.className = 'text-center d-none';
      getRecipes(recognizedImageLabel);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

const dataForGetRecipe = {
  diet: null,
  intolerances: null
};

// GET request to Spoonacular's API with label from Google to get a list of up to 10 recipes containing the item from the image and other nutrition info.
function getRecipes(recognizedImageLabel) {
  recipeDownloadIndicator.className = 'text-center';
  var spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?query=${recognizedImageLabel}&apiKey=${spoonacularAPIKey}&addRecipeNutrition=true`;
  $.ajax({
    method: 'GET',
    url: spoonacularURL,
    data: dataForGetRecipe,
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (data) {
      recipeOnPage(data);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//* image on page
function displayImage(imageURL) {
  const imageURLParameter = imageURL;
  const imageLoader = {};
  imageLoader.LoadImage = function (imageURLParameter, progressUpdateCallback) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', imageURL, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function (e) {
        if (e.lengthComputable) {
          let percentComplete = e.loaded / e.total;
          $('#download_progress').css({
            width: percentComplete * 100 + '%'
          });
          if (percentComplete > 0 && percentComplete < 1) {
            $('#image_download_container').removeClass('d-none');
          }
          if (percentComplete === 1) {
            $('#image_download_container').addClass('d-none');
          }
        }
      };
      xhr.onloadend = function () {
        let options = {};
        let headers = xhr.getAllResponseHeaders();
        let typeMatch = headers.match(/^Content-Type:\s*(.*?)$/mi);

        if (typeMatch && typeMatch[1]) {
          options.type = typeMatch[1];
        }

        let blob = new Blob([this.response], options);
        resolve(window.URL.createObjectURL(blob));
      };
      xhr.send();
    });

  };
  imageLoaderFunction(imageLoader, imageURLParameter);
}

function imageLoaderFunction(imageLoader, imageURL) {
  imageLoader.LoadImage('imageURL')
    .then(image => {
      myImage.src = imageURL;
    });
}

function displayImageTitle(recognizedImageLabel) {
  const titleContainer = document.getElementById('title_container');
  const h1 = document.createElement('h1');
  h1.id = 'title';
  h1.textContent = recognizedImageLabel;
  titleContainer.append(h1);
}

//* image end

//* recipes start
function recipeOnPage(recipes) {
  const recipeContainer = document.getElementById('recipes_container');
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
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card card mb-5 mx-3 pt-3 col-xs-12';
    recipeCard.id = 'recipe';
    const anchorTag = document.createElement('a');
    const titleAnchorTag = document.createElement('a');
    anchorTag.href = recipeURL;
    titleAnchorTag.href = recipeURL;
    anchorTag.className = 'stretched-link d-flex justify-content-center';
    const img = document.createElement('img');
    img.className = 'card-image-top';
    img.src = imageURL;
    img.alt = 'Recipe Image';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = title;
    const cardText1 = document.createElement('div');
    cardText1.className = 'card-text';
    const minutesSpan = document.createElement('span');
    minutesSpan.className = 'badge badge-dark mr-1 mb-1';
    minutesSpan.textContent = `${readyInMinutes} Minutes`;
    const servingsSpan = document.createElement('span');
    servingsSpan.className = 'badge badge-dark mb-1';
    servingsSpan.textContent = `${servings} Servings`;
    cardText1.append(minutesSpan);
    cardText1.append(servingsSpan);
    const cardText2 = document.createElement('div');
    cardText2.className = 'card-text d-flex flex-wrap';
    const calorieSpan = document.createElement('span');
    calorieSpan.className = 'badge badge-secondary mb-1 mr-1';
    calorieSpan.textContent = `${caloriesAmount} Calories`;
    const carbsSpan = document.createElement('span');
    carbsSpan.className = 'badge badge-secondary mb-1 mr-1';
    carbsSpan.textContent = `${carbsAmount}g Carbs`;
    const fatSpan = document.createElement('span');
    fatSpan.className = 'badge badge-secondary mb-1 mr-1';
    fatSpan.textContent = `${fatAmount}g Total Fat`;
    const proteinSpan = document.createElement('span');
    proteinSpan.className = 'badge badge-secondary mb-1 mr-1';
    proteinSpan.textContent = `${proteinAmount}g Protein`;
    const sodiumSpan = document.createElement('span');
    sodiumSpan.className = 'badge badge-secondary mb-1 mr-1';
    sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
    const cardText3 = document.createElement('div');
    cardText3.className = 'card=text d-flex flex-wrap';
    if (recipes.results[i].diets) {
      for (var j = 0; j < recipes.results[i].diets.length; j++) {
        const dietSpan = document.createElement('span');
        dietSpan.className = 'badge badge-light mb-1 mr-1';
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
  document.getElementById('recipe_download_text').className = 'text-center d-none';
}
