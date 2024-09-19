import { AppStateManager } from "./AppStateManager.js";
import { DOMManager } from "./DOMManager.js";
import { Form } from "./Form.js";
import { ImageTitleHandler } from "./ImageTitleHandler.js";
import { RecipesHandler } from "./RecipesHandler.js";
import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  // First, define the function to get credentials based on environment
  function getCredentials() {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      // Use environment variables in production
      return Promise.resolve({
        imgurClientID: process.env.imgurClientID,
        imgurClientSecret: process.env.imgurClientSecret,
        imgurAlbumID: process.env.imgurAlbumID,
        imgurAuthorizationCode: process.env.imgurAuthorizationCode,
        imgurRefreshToken: process.env.imgurRefreshToken,
        spoonacularAPIKey: process.env.spoonacularAPIKey,
        googleAPIKey: process.env.googleAPIKey,
      });
    } else {
      // Use dynamic import for development config
      return import("../config/config.js")
        .then((module) => ({
          imgurClientID: module.imgurClientID,
          imgurClientSecret: module.imgurClientSecret,
          imgurAlbumID: module.imgurAlbumID,
          imgurAuthorizationCode: module.imgurAuthorizationCode,
          imgurRefreshToken: module.imgurRefreshToken,
          spoonacularAPIKey: module.spoonacularAPIKey,
          googleAPIKey: module.googleAPIKey,
        }))
        .catch((error) => {
          console.error("Error loading config:", error);
          return {}; // Return empty object on error
        });
    }
  }

  // Now call getCredentials and wait for credentials before creating the AppStateManager
  getCredentials().then((credentials) => {
    const {
      imgurClientID,
      imgurClientSecret,
      imgurAlbumID,
      imgurAuthorizationCode,
      imgurRefreshToken,
      spoonacularAPIKey,
      googleAPIKey,
    } = credentials;

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
});
