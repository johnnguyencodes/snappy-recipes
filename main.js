const headerElement = document.querySelector("form");
const newPageHeader = new PageHeader(headerElement);

// const dietaryRestrictions = document.getElementById("dietary_restrictions");
// const dietaryIntolerances = document.getElementById("dietary_intolerances");
const newDietForm = new DietForm(dietMenu);

const imageContainer = document.getElementById("image_container");
const titleContainer = document.getElementById("title_container");
const newImageTitleContainer = new ImageTitleContainer(imageContainer, titleContainer);

const recipesContainer = document.getElementById("recipes_container");
const newRecipesContainer = new RecipesContainer(recipesContainer);

const favoritedRecipesElement = document.getElementById("favorited_recipes_element");
const newFavoritedRecipesElement = new FavoritedRecipesElement(favoritedRecipesElement);

const newApp = new App(newPageHeader, newImageTitleContainer, newRecipesContainer, newFavoritedRecipesElement, newDietForm);
newApp.start();
