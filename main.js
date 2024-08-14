const form = new Form();

const imageTitleHandler = new ImageTitleHandler();

const searchRecipesContainer = document.getElementById(
  "search_recipes_container"
);
const favoriteRecipesContainer = document.getElementById(
  "favorite_recipes_container"
);
const recipesHandler = new RecipesHandler(
  searchRecipesContainer,
  favoriteRecipesContainer
);

const app = new App(form, imageTitleHandler, recipesHandler);
app.start();
