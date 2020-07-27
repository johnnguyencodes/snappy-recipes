var headerElement = document.querySelector("header");
var newHeader = new Header(headerElement);

var dietMenu = document.getElementById("diet_menu");
var dietaryRestrictions = document.getElementById("dietary_restrictions");
var dietaryIntolerances = document.getElementById("dietary_intolerances");
var closeButton = document.getElementById("close_button");
var newForm = new Form(dietMenu, dietaryRestrictions, dietaryIntolerances, closeButton);

var imageContainer = document.getElementById("image_container");
var titleContainer = document.getElementById("title_container");
var newImageTitleContainer = new ImageTitleContainer(imageContainer, titleContainer);

var recipesContainer = document.getElementById("recipes_container");
var newRecipesContainer = new RecipesContainer(recipesContainer);
var newApp = new App(newHeader, newForm, newImageTitleContainer, newRecipesContainer);
