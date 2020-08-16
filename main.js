const newForm = new Form();

const newDietMenu = new DietMenu();

const titleContainer = document.getElementById("title_container");
const newImageTitleContainer = new ImageTitleContainer(titleContainer);

const searchRecipesContainer = document.getElementById("search_recipes_container");
const favoriteRecipesContainer = document.getElementById("favorite_recipes_container");
const newRecipesHandler = new RecipesHandler(searchRecipesContainer, favoriteRecipesContainer);

const newApp = new App(newForm, newImageTitleContainer, newRecipesHandler, newDietMenu);
newApp.start();
