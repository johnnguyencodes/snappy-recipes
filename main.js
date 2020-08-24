const newForm = new Form();

const newDietMenu = new DietMenu();

const newImageTitleHandler = new ImageTitleHandler();

const searchRecipesContainer = document.getElementById("search_recipes_container");
const favoriteRecipesContainer = document.getElementById("favorite_recipes_container");
const newRecipesHandler = new RecipesHandler(searchRecipesContainer, favoriteRecipesContainer);

const newApp = new App(newForm, newDietMenu, newImageTitleHandler, newRecipesHandler);
newApp.start();
