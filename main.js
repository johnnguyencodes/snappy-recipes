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


//GET request to IMGUR with image id supplied of an apple
// $.ajax({
//   method: "GET",
//   url: "https://api.imgur.com/3/image/csFntM8",
//   headers: {
//     "Authorization": "Client-ID 62cbd49ff79d018",
//     "Content-Type": "application/json"
//   },
//   success: function(data) {
//     console.log(data);
//   },
//   error: function(err) {
//     console.log(err)
//   }
// })


$.ajax({
  method: "GET",
  url: "https://api.imgur.com/3/image/kqSaPhf",
  headers: {
    "Authorization": "Client-ID 62cbd49ff79d018",
    "Content-Type": "application/json"
  },
  success: function(data) {
    console.log(data.data.link);
    // startSpoonacular(data.data.link);
  },
  error: function(err) {
    console.log(err)
  }
})

var dataToSend = {
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": "https://i.imgur.com/kqSaPhf.jpg"
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

$.ajax({
  url: "https://vision.googleapis.com/v1/images:annotate?fields=responses&key=AIzaSyAJzv7ThEspgv8_BxX2EwCs8PUEJMtJN6c",
  type: "POST",
  data: dataToSend,
  success: function (response) {
    console.log(response);
  },
  error: function(err) {
    console.log(err);
  }
});

// function startSpoonacular(data) {
//   var spoonacularURL = "https://api.spoonacular.com/food/images/analyze?imageUrl=" + data + "&apiKey=5d83fe3f2cf14616a6ea74137c2be564"
//   $.ajax({
//     method: "GET",
//     url: spoonacularURL,
//     headers: {
//       "Content-Type": "application/json"
//     },
//     success: function(data) {
//       console.log(data);
//     },
//     error: function(err) {
//       console.log(err);
//     }
//   })
// }

// function startWatson(data) {
//   var watsonURL = "https://api.us-south.visual-recognition.watson.cloud.ibm.com/v3/classify?url=" + data + "&version=2018-03-19";
//   $.ajax({
//     method: "GET",
//     url: watsonURL,
//     data: {
//       apikey: "7hFCtrlfYDTXJ-KaBq4CwxviS7iee5NAQD_NaIX4pogE"
//     },
//     headers: {
//       "Content-Type": "application/json"
//     },
//     success: function(data) {
//       console.log(data);
//     },
//     error: function(err) {
//       console.log(err)
//     }
//   });
// }
// curl -u "apikey:7hFCtrlfYDTXJ-KaBq4CwxviS7iee5NAQD_NaIX4pogE"
// "https://api.us-south.visual-recognition.watson.cloud.ibm.com/v3/classify?url=https://i.imgur.com/kqSaPhf.jpg&version=2018-03-19"
