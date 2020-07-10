// $.ajax({
//   method: "GET",
//   url: "https://jsonplaceholder.typicode.com/users",
//   success: generateUserData,
//   error: function(err) {
//     console.log(err)
//   }
// })

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
$.ajax({
  method: "GET",
  url: "https://api.imgur.com/3/image/69SUs49",
  headers: {
    "Authorization": "Client-ID 62cbd49ff79d018",
    "Content-Type": "application/json"
  },
  success: function(data) {
    console.log("Imgur:", data.data.link);
    googleDataToSend.requests[0].image.source.imageUri =  data.data.link;
    startGoogle();
  },
  error: function(err) {
    console.log(err)
  }
})

//POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
function startGoogle(data) {
  $.ajax({
    url: "https://vision.googleapis.com/v1/images:annotate?fields=responses&key=AIzaSyAJzv7ThEspgv8_BxX2EwCs8PUEJMtJN6c",
    type: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(googleDataToSend),
    success: function (response) {
      console.log("Google:", response.responses[0].labelAnnotations[0].description)
      startSpoonacular(response.responses[0].labelAnnotations[0].description);

    },
    error: function (err) {
      console.log(err);
    }
  });
}

//GET request to Spoonacular's API with label from Google to get a list of up to 10 recipes containing the item from the image.
function startSpoonacular(data) {
  var spoonacularURL = "https://api.spoonacular.com/recipes/complexSearch?query=" + data + "&apiKey=5d83fe3f2cf14616a6ea74137c2be564&addRecipeNutrition=true"
  $.ajax({
    method: "GET",
    url: spoonacularURL,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(data) {
      console.log("Spoonacular:", data);
      for (var i = 0; i < data.results.length; i++) {
        console.log(`Spoonacular recipe ${data.results[i].title}`)
      }
    },
    error: function(err) {
      console.log(err);
    }
  })
}
