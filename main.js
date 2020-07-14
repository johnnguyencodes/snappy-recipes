const uploadButton = document.getElementById("button");
uploadButton.addEventListener("click", event => fileValidation(event));

//file validation checker
function fileValidation(event) {
  event.preventDefault();
  if (document.getElementById("image-on-page")) {
    document.getElementById("image-on-page").remove();
  }
  const fileInput = document.getElementById("input-form");
  const imageFile = fileInput.files[0];
  if (!(imageFile)) {
    alert("Error: No file selected, please select a file to upload.");
    fileInput.value = "";
    return;
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
  alert(`You have chosen the file ${imageFile.name}`);
  formData.append("image", imageFile);
  startImgurAPI(formData);
  fileInput.value = "";
}

//data for startGoogleAPI() function to POST
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

//GET request to IMGUR with image id supplied
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
  success: function(data) {
    const imageURL = data.data.link;
    googleDataToSend.requests[0].image.source.imageUri = imageURL;
    imageOnPage(imageURL);
    // startGoogleAPI();
  },
  error: function(err) {
    console.log(err)
  }
  })
}

//POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
function startGoogleAPI() {
  $.ajax({
    url: "https://vision.googleapis.com/v1/images:annotate?fields=responses&key=AIzaSyAJzv7ThEspgv8_BxX2EwCs8PUEJMtJN6c",
    type: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(googleDataToSend),
    success: function (response) {
      if (!(response.responses[0].labelAnnotations)) {
        alert("Sorry, google Cloud VISION API could not label your image correctly, please try another image");
        resetImageOnPage();
        return;
      }
      const imageTitle = response.responses[0].labelAnnotations[0].description;
      imageTitleOnPage(imageTitle);
      startSpoonacularAPI(imageTitle);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//GET request to Spoonacular's API with label from Google to get a list of up to 10 recipes containing the item from the image and other nutrition info.
function startSpoonacularAPI(imageTitle) {
  var spoonacularURL = "https://api.spoonacular.com/recipes/complexSearch?query=" + imageTitle + "&apiKey=5d83fe3f2cf14616a6ea74137c2be564&addRecipeNutrition=true"
  $.ajax({
    method: "GET",
    url: spoonacularURL,
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
  const imageContainer = document.getElementById("image-container");
  const img = document.createElement("img");
  img.id = "image-on-page"
  img.src = imageURL;
  img.alt = "Uploaded Image"
  imageContainer.append(img);
}

function resetImageOnPage() {
  document.getElementById("uploaded-image").remove();
}

function imageTitleOnPage(imageTitle) {
  const titleContainer = document.getElementById("title-container");
  const h1 = document.createElement("h1");
  h1.textContent = imageTitle;
  titleContainer.append(h1);
}

function recipeOnPage(recipes) {
  const recipeContainer = document.getElementById("recipes-container");
  for (let i = 0; i < recipes.results.length; i++) {
    const imageURL = recipes.results[i].image;
    const title = recipes.results[i].title;
    const readyInMinutes = recipes.results[i].readyInMinutes;
    const servings = recipes.results[i].servings;
    const recipeURL = recipes.results[i].sourceUrl;
    const summary = recipes.results[i].summary;
    const healthScore = recipes.results[i].healthScore;
    const caloriesAmount = recipes.results[i].nutrition.nutrients[0].amount;
    const proteinAmount = recipes.results[i].nutrition.nutrients[8].amount;
    const fatAmount = recipes.results[i].nutrition.nutrients[1].amount
    const carbsAmount = recipes.results[i].nutrition.nutrients[3].amount;
    const sodiumAmount = recipes.results[i].nutrition.nutrients[7].amount;
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card card mb-3 col-xs-12";
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
    const cardText1 = document.createElement("p");
    cardText1.className = "card-text";
    cardText1.textContent = `Ready in ${readyInMinutes} minutes, ${servings} servings.`;
    const cardText2 = document.createElement("p");
    cardText2.className = "card-text";
    cardText2.textContent = `${caloriesAmount} calories, ${carbsAmount} g carbs, ${fatAmount} g fat, ${proteinAmount} g protein, ${sodiumAmount} mg sodium.`;
    cardTitle.append(recipeTitle);
    cardTitle.append(cardText1);
    cardTitle.append(cardText2);
    cardBody.append(cardTitle);
    anchorTag.append(img);
    recipeCard.append(anchorTag);
    recipeCard.append(cardBody);
    recipeContainer.append(recipeCard);
  }
}
