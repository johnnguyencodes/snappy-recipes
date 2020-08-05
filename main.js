const newPageHeader = new PageHeader();

// const dietaryRestrictions = document.getElementById("dietary_restrictions");
// const dietaryIntolerances = document.getElementById("dietary_intolerances");
const newDietForm = new DietForm(dietMenu);

const titleContainer = document.getElementById("title_container");
const newImageTitleContainer = new ImageTitleContainer(titleContainer);

const recipesContainer = document.getElementById("recipes_container");
const favoritedRecipesContainer = document.getElementById("favorited_recipes_container");
const newRecipesHandler = new RecipesHandler(recipesContainer, favoritedRecipesContainer);

const newApp = new App(newPageHeader, newImageTitleContainer, newRecipesHandler, newDietForm);
newApp.start();
