$.ajax({
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/users",
  success: generateUserData,
  error: function(err) {
    console.log(err)
  }
})

function generateUserData(data) {
  const userData = document.getElementById("user-data");
  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");
    const userId = document.createElement("td");
    const name = document.createElement("td");
    const email = document.createElement("td");
    userId.textContent = data[i].id;
    name.textContent = data[i].name;
    email.textContent = data[i].email;
    tr.append(userId);
    tr.append(name);
    tr.append(email);
    userData.append(tr);
  }
}
