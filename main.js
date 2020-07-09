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
  url: "https://api.imgur.com/3/image/csFntM8",
  headers: {
    "Authorization": "Client-ID 62cbd49ff79d018",
    "Content-Type": "application/json"
  },
  success: function(data) {
    startWatson(data);
  },
  error: function(err) {
    console.log(err)
  }
})

function startWatson(data) {
  $.ajax({
    method: "GET",
    url: "https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/d0911929-4812-48d8-ba0c-918b93722084",
    headers: {
      "apikey": "7hFCtrlfYDTXJ-KaBq4CwxviS7iee5NAQD_NaIX4pogE",
      "Content-Type": "application/json",
      "url": data.link
    },
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log(err)
    }
  });
}
