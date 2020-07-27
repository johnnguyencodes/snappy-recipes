document.getElementById('file_input_form').addEventListener('change', function (e) {
  var fileName = document.getElementById("file_input_form").files[0].name;
  if (fileName) {
    document.getElementById("file_input_form").disabled = true;
  }
  document.getElementById("custom_file_label").textContent = fileName;
})

resetFields() {
  event.preventDefault();
  const inputs = document.querySelectorAll(".input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = false;
  }
  document.getElementById("file_input_form").value = "";
  document.getElementById("custom_file_label").textContent = "";
  if (document.getElementById("title")) {
    document.getElementById("title").remove();
  }
  document.getElementById("recipe_search_input").value = "";
  document.getElementById("my_image").src = "";
  while (document.getElementById("recipe")) {
    document.getElementById("recipe").remove();
  }
}

search(query) {
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
  getRecipes(query);
}
