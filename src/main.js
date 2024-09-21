import { AppStateManager } from "./AppStateManager.js";
import { DOMManager } from "./DOMManager.js";
import { Form } from "./Form.js";
import { ImageTitleHandler } from "./ImageTitleHandler.js";
import { RecipesHandler } from "./RecipesHandler.js";
import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  const appStateManager = new AppStateManager();

  const domManager = new DOMManager();

  const form = new Form(domManager, appStateManager);

  const imageTitleHandler = new ImageTitleHandler(domManager);

  const searchRecipesContainer = document.getElementById(
    "search_recipes_container"
  );
  const favoriteRecipesContainer = document.getElementById(
    "favorite_recipes_container"
  );
  const recipesHandler = new RecipesHandler(
    searchRecipesContainer,
    favoriteRecipesContainer,
    domManager,
    appStateManager
  );

  const app = new App(
    form,
    imageTitleHandler,
    recipesHandler,
    domManager,
    favoriteRecipesContainer,
    appStateManager
  );
  app.start();
});
