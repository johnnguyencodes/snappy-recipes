const uploadButton = document.getElementById("button");
uploadButton.addEventListener("click", event => fileValidation(event));

//file validation checker
function fileValidation(event) {
  event.preventDefault();
  const fileInput = document.getElementById("input-form");
  const imageFile = fileInput.files[0];
  if (!(imageFile)) {
    alert("Error: No file selected, please select a file to upload.");
    return;
  }
  const fileType = imageFile.type;
  const formData = new FormData();
  const mimeTypes = ['image/jpg', 'image/png', 'image/gif'];
  if (!(mimeTypes.indexOf(fileType))) {
    alert("Error: Incorrect file type, please select a jpeg, png or gif file.");
    return;
  }
  if (imageFile.size > 10 * 1024 * 1024) {
    alert("Error: Image exceeds 10MB size limit");
    return;
  }
  alert(`You have chosen the file ${imageFile.name}`);
  formData.append("image", imageFile);
  console.log(formData);
  startImgurAPI(formData);
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
      console.log("Spoonacular:", data);
      recipeOnPage(data);
    },
    error: function(err) {
      console.log(err);
    }
  })
}

function imageOnPage(imageURL) {
  console.log("imageOnPage");
  const imageContainer = document.getElementById("image-container");
  const img = document.createElement("img");
  img.src = imageURL;
  img.height = "225";
  img.width = "300";
  imageContainer.append(img);
}

function imageTitleOnPage(imageTitle) {
  const titleContainer = document.getElementById("title-container");
  const h1 = document.createElement("h1");
  h1.textContent = imageTitle;
  titleContainer.append(h1);
}

function recipeOnPage(recipes) {
  const recipeContainer = document.getElementById("recipe-container");
  // const imageURL = recipes.results[0].image;
  // const title = recipes.results[0].title;
  // const readyInMinutes = recipes.results[0].readyInMinutes;
  // const servings = recipes.results[0].servings;
  // const recipeURL = recipes.results[0].sourceUrl;
  // const healthScore = recipes.results[0].healthScore;
  // const caloriesAmount = recipes.results[0].nutrition.nutrients[0].amount;
  // const proteinAmount = recipes.results[0].nutrition.nutrients[8].amount;
  // const fatAmount = recipes.results[0].nutrition.nutrients[1].amount
  // const carbsAmount = recipes.results[0].nutrition.nutrients[3].amount;

  const imageURL = "https://spoonacular.com/recipeImages/46384-312x231.jpg"
  const title = "Yam Purée"
  const readyInMinutes = 120;
  const servings = 4
  const recipeURL = "http://www.cookstr.com/recipes/yam-pureacutee"
  const healthScore = 0;
  const caloriesAmount = 181.75;
  const proteinAmount = 0.08;
  const fatAmount = 18.06;
  const carbsAmount = 5.97;
}

// function generateUserData(data) {
//   const userData = document.getElementById("user-data");
//   for (let i = 0; i < data.length; i++) {
//     const tr = document.createElement("tr");
//     const userId = document.createElement("td");
//     const name = document.createElement("td");
//     const email = document.createElement("td");
//     userId.textContent = data[i].id;
//     name.textContent = data[i].name;
//     email.textContent = data[i].email;
//     tr.append(userId);
//     tr.append(name);
//     tr.append(email);
//     userData.append(tr);
//   }
// }
