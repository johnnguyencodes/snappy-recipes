import { AppStateManager } from "./AppStateManager.js";
import { DOMManager } from "./DOMManager.js";
import { Form } from "./Form.js";
import { ImageTitleHandler } from "./ImageTitleHandler.js";
import { RecipesHandler } from "./RecipesHandler.js";
import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  const imgurClientID = `__IMGUR_CLIENT_ID__`;
  const imgurClientSecret = `__IMGUR_CLIENT_SECRET__`;
  const imgurAlbumID = `__IMGUR_ALBUM_ID__`;
  const imgurAuthorizationCode = `__IMGUR_AUTHORIZATION_CODE__`;
  const imgurRefreshToken = `__IMGUR_REFRESH_TOKEN__`;
  const spoonacularAPIKey = `__SPOONACULAR_API_KEY__`;
  const googleAPIKey = "__GOOGLE_API_KEY__";

  console.log("googleAPIKey", googleAPIKey);
  // Now that you have the credentials, create your AppStateManager
  const appStateManager = new AppStateManager(
    imgurClientID,
    imgurClientSecret,
    imgurAlbumID,
    imgurAuthorizationCode,
    imgurRefreshToken,
    spoonacularAPIKey,
    googleAPIKey
  );

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
