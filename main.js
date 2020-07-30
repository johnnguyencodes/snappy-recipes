const headerElement = document.querySelector("form");
const newPageHeader = new PageHeader(headerElement);

// const dietaryRestrictions = document.getElementById("dietary_restrictions");
// const dietaryIntolerances = document.getElementById("dietary_intolerances");
// const closeButton = document.getElementById("close_button");
// const newDietForm = new DietForm(dietMenu, dietaryRestrictions, dietaryIntolerances, closeButton);

const imageContainer = document.getElementById("image_container");
const titleContainer = document.getElementById("title_container");
const newImageTitleContainer = new ImageTitleContainer(imageContainer, titleContainer);

const recipesContainer = document.getElementById("recipes_container");
const newRecipesContainer = new RecipesContainer(recipesContainer);
const newApp = new App(newPageHeader, newImageTitleContainer, newRecipesContainer);
newApp.start();
