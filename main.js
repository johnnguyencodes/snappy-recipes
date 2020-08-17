const newForm = new Form();

const newDietMenu = new DietMenu();

const titleContainer = document.getElementById("title_container");
const newImageTitleHandler = new ImageTitleHandler(titleContainer);

const searchRecipesContainer = document.getElementById("search_recipes_container");
const favoriteRecipesContainer = document.getElementById("favorite_recipes_container");
const newRecipesHandler = new RecipesHandler(searchRecipesContainer, favoriteRecipesContainer);

const newApp = new App(newForm, newDietMenu, newImageTitleHandler, newRecipesHandler);
newApp.start();
