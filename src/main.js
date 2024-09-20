import { AppStateManager } from "./AppStateManager.js";
import { DOMManager } from "./DOMManager.js";
import { Form } from "./Form.js";
import { ImageTitleHandler } from "./ImageTitleHandler.js";
import { RecipesHandler } from "./RecipesHandler.js";
import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  let imgurClientID;
  let imgurClientSecret;
  let imgurAlbumID;
  let imgurAuthorizationCode;
  let imgurRefreshToken;
  let spoonacularAPIKey;
  let googleAPIKey;

  // First, define the function to get credentials based on environment
  async function getCredentials() {
    if (process.env.NODE_ENV === "production") {
      // Use environment variables in production
      return {
        imgurClientID: process.env.IMGUR_CLIENT_ID,
        imgurClientSecret: process.env.IMGUR_CLIENT_SECRET,
        imgurAlbumID: process.env.IMGUR_ALBUM_ID,
        imgurAuthorizationCode: process.env.IMGUR_AUTHORIZATION_CODE,
        imgurRefreshToken: process.env.IMGUR_REFRESH_TOKEN,
        spoonacularAPIKey: process.env.SPOONACULAR_API_KEY,
        googleAPIKey: process.env.GOOGLE_API_KEY,
      };
    } else {
      // Dynamically import config.js in development
      try {
        const module = await import("../config/config.js");
        return {
          imgurClientID: module.imgurClientID,
          imgurClientSecret: module.imgurClientSecret,
          imgurAlbumID: module.imgurAlbumID,
          imgurAuthorizationCode: module.imgurAuthorizationCode,
          imgurRefreshToken: module.imgurRefreshToken,
          spoonacularAPIKey: module.spoonacularAPIKey,
          googleAPIKey: module.googleAPIKey,
        };
      } catch (error) {
        console.error("Error loading config in development:", error);
        return {}; // Return empty object on error
      }
    }
  }

  // Now call getCredentials and wait for credentials before creating the AppStateManager
  getCredentials().then((credentials) => {
    // In production, you may skip destructuring if environment variables are already available
    if (credentials) {
      ({
        imgurClientID,
        imgurClientSecret,
        imgurAlbumID,
        imgurAuthorizationCode,
        imgurRefreshToken,
        spoonacularAPIKey,
        googleAPIKey,
      } = credentials);

      console.log("googleAPIKey", googleAPIKey);
      console.log("process", typeof process);
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
    }
  });
});
