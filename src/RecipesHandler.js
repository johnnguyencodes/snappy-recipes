export class RecipesHandler {
  constructor(
    searchRecipesContainer,
    favoriteRecipesContainer,
    domManager,
    appStateManager
  ) {
    this.searchRecipesContainer = searchRecipesContainer;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    this.domManager = domManager;
    this.appStateManager = appStateManager;
    this.chunkSize = 12; // Configurable chunk size

    // Bind methods to ensure correct `this` context
    this.handleShowMoreScroll = this.handleShowMoreScroll.bind(this);
    this.handleBackToTopClick = this.handleBackToTopClick.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleFavoriteButtonClick = this.handleFavoriteButtonClick.bind(this);
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown =
      this.updateResultsQuantityShown.bind(this);
    this.favoriteCheck = this.favoriteCheck.bind(this);

    // Event listeners
    window.addEventListener("scroll", this.handleShowMoreScroll);
    this.domManager.recipes.backToTopButton.addEventListener(
      "click",
      this.handleBackToTopClick
    );
    this.domManager.recipes.modalContainer.addEventListener(
      "click",
      this.closePreview
    );
    this.domManager.app.closePreviewXButton.addEventListener(
      "click",
      this.closePreview
    );
  }

  // Method to register external event handler from App.js
  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkRecipes(recipes, type = "searched") {
    const { app } = this.domManager;

    app.recipeInformation = recipes;

    // Handle empty result case
    if (!recipes.results.length) {
      this.showNoRecipesMessage();
      this.enableInputs();
      return;
    }

    // Handle non-empty results
    this.updateResultsQuantity(type, recipes.results.length);

    // Setting new chunked array of recipes as current chunk
    const tempRecipeArray =
      this.appStateManager.getState("chunkedRecipeArray") || [];
    for (let i = 0; i < recipes.results.length; i += this.chunkSize) {
      tempRecipeArray.push(recipes.results.slice(i, i + this.chunkSize));
    }
    this.appStateManager.setState("chunkedRecipeArray", tempRecipeArray);

    // Handling UI updates
    this.displaySearchedRecipes(
      this.appStateManager.getState("chunkedRecipeArray"),
      this.appStateManager.getState("chunkedRecipeArrayIndex")
    );
    if (recipes.results.length > this.chunkSize) {
      this.showResultsQuantity();
    }
    this.updateResultsQuantityShown();
  }

  // Displays message when no recipes are found
  showNoRecipesMessage() {
    const { app } = this.domManager;
    app.searchRecipesDownloadProgress.classList = "recipe-progress-hidden mt-3";
    app.searchRecipesDownloadText.classList = "d-none";
    app.noSearchRecipesText.classList = "text-center mt-3";
  }

  // Update recipe count display
  updateResultsQuantity(type, count) {
    const text = `${count} ${type} recipes found`;
    this.domManager.recipes.searchResultsQuantityText.textContent = text;
    this.domManager.app.searchResultsQuantityDiv.classList =
      "d-flex justify-content-center mt-3";
  }

  // Shows the results quantity div when more than `chunkSize` recipes
  showResultsQuantity() {
    this.domManager.app.resultsShownQuantityDiv.classList =
      "d-flex flex-column align-items-center justify-content-center mb-3";
  }

  // Handle scrolling to load more recipes
  handleShowMoreScroll() {
    const { scrollTop, scrollHeight } = document.documentElement;
    const { innerHeight } = window;

    if (scrollTop + innerHeight >= scrollHeight - 5) {
      const currentIndex = this.appStateManager.getState(
        "chunkedRecipeArrayIndex"
      );
      const chunkedArray = this.appStateManager.getState("chunkedRecipeArray");

      if (currentIndex < chunkedArray.length - 1) {
        this.appStateManager.setState(
          "chunkedRecipeArrayIndex",
          currentIndex + 1
        );
        this.displaySearchedRecipes(chunkedArray, currentIndex + 1);
        this.updateResultsQuantityShown();
      }
    }
  }

  // Scroll back to top of the page
  handleBackToTopClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Update the number of recipes currently being shown
  updateResultsQuantityShown() {
    const totalShown = document.querySelectorAll(".recipe-card").length;
    const totalFoundText =
      this.domManager.recipes.searchResultsQuantityText.textContent;
    const totalFound = parseInt(totalFoundText.match(/\d+/)[0], 10);
    this.domManager.recipes.resultsShownQuantityText.textContent = `Showing ${totalShown} of ${totalFound}`;
  }

  // Handle favorite clicks from search results
  handleFavoriteClick(event, id) {
    event.stopPropagation();
    const heartIcon = document.getElementById(`heart_icon_${id}`);

    let favorites = this.appStateManager.getState("favoriteArray") || [];
    if (!favorites.includes(id)) {
      favorites.push(id);
      heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
    } else {
      favorites = favorites.filter((favId) => favId !== id);
      heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
    }

    this.appStateManager.setState("favoriteArray", favorites);
    localStorage.setItem("favoriteArray", JSON.stringify(favorites));
  }

  // Handle delete click event for favorite recipe cards
  handleDeleteClick(event, id) {
    event.stopPropagation();
    const recipeCard = document.getElementById(`${id}`);

    let favorites = this.appStateManager.getState("favoriteArray") || [];
    favorites = favorites.filter((favId) => favId !== id);
    this.appStateManager.setState("favoriteArray", favorites);
    localStorage.setItem("favoriteArray", JSON.stringify(favorites));

    recipeCard.remove();

    if (!favorites.length) {
      this.domManager.app.emptyFavoriteTextContainer.classList =
        "d-flex justify-content-center";
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }

    this.favoriteCheck(id);
  }

  // Handle favorite button click on modal
  handleFavoriteButtonClick(event, id) {
    event.stopPropagation();

    const favoriteButton = document.getElementById("favorite_button");
    let favorites = this.appStateManager.getState("favoriteArray") || [];

    if (!favorites.includes(id)) {
      favorites.push(id);
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from favorites";
      const heartIcon = document.getElementById(`heart_icon_${id}`);
      if (heartIcon) {
        heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      }
    } else {
      favorites = favorites.filter((favId) => favId !== id);
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      const heartIcon = document.getElementById(`heart_icon_${id}`);
      if (heartIcon) {
        heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
      }

      this.appStateManager.setState("favoriteArray", favorites);
      localStorage.setItem("favoriteArray", JSON.stringify(favorites));

      if (!favorites.length) {
        this.domManager.app.emptyFavoriteTextContainer.classList =
          "d-flex justify-content-center";
      }

      // Handle updating UI when favorite section is open
      if (
        this.domManager.app.favoriteRecipesSection.classList.contains(
          "favorite-recipes-visible"
        )
      ) {
        this.getFavoriteRecipes();
      }
    }
  }

  // Check and update favorite icons based on favoriteArray
  favoriteCheck() {
    const favorites = this.appStateManager.getState("favoriteArray") || [];
    const heartIcons = document.querySelectorAll("#heart_container i");
    heartIcons.forEach((icon) => {
      const iconId = parseInt(icon.id.replace("heart_icon_", ""), 10);
      if (favorites.includes(iconId)) {
        icon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        icon.classList = "far fa-heart text-danger heart-icon fa-lg";
      }
    });
  }

  // Modal management and closing logic
  modalHandler(
    imageURL,
    title,
    recipeURL,
    id,
    instructions,
    ingredients,
    summary
  ) {
    if (!ingredients) {
      return;
    }
    // this.domManager.recipes.overlayPreview.classList = "";

    const { recipeInstructions, recipeIngredients, modalButtonContainer } =
      this.domManager.recipes;
    const recipeTitle = document.getElementById("recipe_title");
    const recipeImage = document.getElementById("recipe_image");
    const recipeSummary = document.getElementById("recipe_summary");

    // Clear previous content
    recipeInstructions.innerHTML = "";
    recipeIngredients.innerHTML = "";
    modalButtonContainer.innerHTML = "";

    // Update modal content
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = DOMPurify.sanitize(summary);

    // Create button container for modal footer
    const externalLinkButton = document.createElement("button");
    externalLinkButton.id = "external_link_button";
    externalLinkButton.classList = "btn btn-primary text-white";
    externalLinkButton.textContent = "Recipe Page";
    externalLinkButton.addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });

    const favoriteButton = document.createElement("button");
    favoriteButton.id = "favorite_button";
    favoriteButton.addEventListener("click", (event) =>
      this.handleFavoriteButtonClick(event, id)
    );

    const favorites = this.appStateManager.getState("favoriteArray") || [];
    if (favorites.includes(id)) {
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
    } else {
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
    }

    modalButtonContainer.append(externalLinkButton, favoriteButton);

    // Populate ingredients
    ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
      recipeIngredients.appendChild(li);
    });

    // Populate Instructions
    if (
      !instructions ||
      instructions.length === 0 ||
      instructions[0] === "var article"
    ) {
      instructions = ["Instructions are available on the Recipe Page."];
    }

    instructions.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      recipeInstructions.appendChild(li);
    });

    // Show modal
    this.domManager.recipes.modalContainer.classList.remove("d-none");
    this.domManager.recipes.overlayPreview.classList.remove("d-none");
    this.domManager.recipes.body.classList.add("freeze");
  }

  // Close modal preview
  closePreview(event) {
    const { recipes } = this.domManager;

    if (
      event.target.id === "modal_container" ||
      event.target.id === "close_preview_x_icon"
    ) {
      const modalBody = document.querySelector(".modal-body");
      modalBody.scrollTo({ top: 0, bevavior: "auto" });

      document.querySelector(".modal-body").scrollTo({
        top: 0,
        behavior: "auto",
      });

      recipes.modalContainer.classList.add("d-none");
      recipes.overlayPreview.classList.add("d-none");
      recipes.body.classList.remove("freeze");

      // Clear modal content
      recipes.recipeInstructions.innerHTML = "";
      recipes.recipeIngredients.innerHTML = "";
      recipes.modalButtonContainer.innerHTML = "";
    }
  }

  // Display recipes on the page
  displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex) {
    const recipes = chunkedRecipeArray[chunkedRecipeArrayIndex];

    recipes.forEach((recipe) => {
      const recipeCard = this.createRecipeCard(recipe);
      this.searchRecipesContainer.appendChild(recipeCard);
    });

    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-hidden mt-3";
    this.domManager.app.searchRecipesDownloadText.classList = "d-none";
    this.enableInputs();
  }

  // Create a recipe card element
  createRecipeCard(recipe) {
    const {
      id,
      image,
      title,
      readyInMinutes,
      servings,
      nutrition,
      sourceUrl,
      analyzedInstructions,
      diets,
      summary,
    } = recipe;

    const imageURL = `${image.substring(0, image.length - 11)}480x360.jpg`;
    const caloriesAmount = Math.round(nutrition.nutrients[0].amount);
    const proteinAmount = Math.round(nutrition.nutrients[8].amount);
    const fatAmount = Math.round(nutrition.nutrients[1].amount);
    const carbsAmount = Math.round(nutrition.nutrients[3].amount);
    const sodiumAmount = Math.round(nutrition.nutrients[7].amount);

    const instructions =
      analyzedInstructions && analyzedInstructions.length > 0
        ? analyzedInstructions[0].steps.map((step) => step.step)
        : ["Instructions are available on the Recipe Page."];
    const ingredients = nutrition.ingredients;
    const summaryText = summary;

    // Create card elements
    const recipeCard = document.createElement("div");
    recipeCard.classList =
      "recipe-card card col-xs-12 col-sm-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
    recipeCard.id = "recipe";

    // Image container
    const imageContainer = document.createElement("div");
    imageContainer.classList =
      "card-image-top d-flex justify-content-center mt-3";

    const img = document.createElement("img");
    img.src = imageURL;
    img.alt = "Recipe Image";
    img.classList = "mb-1 p-0";
    img.width = 240;
    img.height = 180;

    // Heart icon container
    const heartIconContainer = document.createElement("span");
    heartIconContainer.id = "heart_container";
    heartIconContainer.classList =
      "badge badge-light m-1 p-1 border border-danger rounded";

    const heartIcon = document.createElement("i");
    heartIcon.id = `heart_icon_${id}`;
    const favorites = this.appStateManager.getState("favoriteArray") || [];
    heartIcon.classList = favorites.includes(id)
      ? "fas fa-heart text-danger heart-icon fa-lg"
      : "far fa-heart text-danger heart-icon fa-lg";

    heartIconContainer.appendChild(heartIcon);
    heartIconContainer.addEventListener("click", (event) =>
      this.handleFavoriteClick(event, id)
    );
    imageContainer.appendChild(heartIconContainer);
    imageContainer.appendChild(img);

    // Card body
    const cardBody = this.createCardBody(
      title,
      readyInMinutes,
      servings,
      caloriesAmount,
      carbsAmount,
      fatAmount,
      proteinAmount,
      sodiumAmount,
      diets
    );

    // Assemble recipe card
    recipeCard.appendChild(imageContainer);
    recipeCard.appendChild(cardBody);

    // Add event listener for modal
    recipeCard.addEventListener("click", () => {
      this.modalHandler(
        imageURL,
        title,
        sourceUrl,
        id,
        instructions,
        ingredients,
        summaryText
      );
    });

    return recipeCard;
  }

  // Create card body for recipe card
  createCardBody(
    title,
    readyInMinutes,
    servings,
    caloriesAmount,
    carbsAmount,
    fatAmount,
    proteinAmount,
    sodiumAmount,
    diets
  ) {
    const cardBody = document.createElement("div");
    cardBody.classList = "card-body py-0 mb-2";

    // Title
    const cardTitle = document.createElement("div");
    cardTitle.classList = "card-title mb-2";

    const recipeTitle = document.createElement("h5");
    recipeTitle.textContent = title;
    cardTitle.appendChild(recipeTitle);

    // Card text1 (ready in minutes and servings)
    const cardText1 = document.createElement("div");
    cardText1.classList = "card-text";

    const minutesSpan = document.createElement("span");
    minutesSpan.classList = "badge badge-dark mr-1 mb-1";
    minutesSpan.textContent = `${readyInMinutes} Minutes`;

    const servingsSpan = document.createElement("span");
    servingsSpan.classList = "badge badge-dark mb-1";
    servingsSpan.textContent = `${servings} Servings`;

    cardText1.appendChild(minutesSpan);
    cardText1.appendChild(servingsSpan);

    // Card text2 (nutrients)
    const cardText2 = document.createElement("div");
    cardText2.classList = "card-text d-flex flex-wrap";

    const text2Class = "badge badge-secondary mb-1 mr-1";
    const nutrientSpans = [
      { text: `${caloriesAmount} Calories` },
      { text: `${carbsAmount}g Carbs` },
      { text: `${fatAmount}g Total Fat` },
      { text: `${proteinAmount}g Protein` },
      { text: `${sodiumAmount}mg Sodium` },
    ];

    nutrientSpans.forEach((nutrient) => {
      const span = document.createElement("span");
      span.classList = text2Class;
      span.textContent = nutrient.text;
      cardText2.appendChild(span);
    });

    // Card text3 (diets)
    const cardText3 = document.createElement("div");
    cardText3.classList = "card-text d-flex flex-wrap";

    if (diets && diets.length > 0) {
      diets.forEach((diet) => {
        const dietSpan = document.createElement("span");
        dietSpan.classList = "badge badge-light mb-1 mr-1";
        dietSpan.textContent = diet;
        cardText3.appendChild(dietSpan);
      });
    }

    // Assemble card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText1);
    cardBody.appendChild(cardText3);
    cardBody.appendChild(cardText2);

    return cardBody;
  }

  // Enable form inputs after loading
  enableInputs() {
    this.domManager.app.inputs.forEach((input) => {
      input.disabled = false;
      input.classList.remove("no-click");
    });
  }

  // Display favorite recipes
  displayFavoriteRecipes(recipes) {
    // Clear previous content
    this.favoriteRecipesContainer.innerHTML = "";

    recipes.forEach((recipe) => {
      const recipeCard = this.createFavoriteRecipeCard(recipe);
      this.favoriteRecipesContainer.appendChild(recipeCard);
    });

    const { favoriteRecipesSection } = this.domManager.app;
    if (
      favoriteRecipesSection.scrollHeight > favoriteRecipesSection.clientHeight
    ) {
      favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }

    this.domManager.app.favoriteRecipesStatusText.classList = "d-none";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipes-progress-hidden";
    this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
  }

  // Create a favorite recipe card
  createFavoriteRecipeCard(recipe) {
    const {
      id,
      image,
      title,
      readyInMinutes,
      servings,
      nutrition,
      sourceUrl,
      analyzedInstructions,
      diets,
      summary,
    } = recipe;

    const imageURL = image
      ? `${image.substring(0, image.length - 11)}480x360.jpg`
      : "https://spoonacular.com/recipeImages/342447-3480x360.jpg";
    const caloriesAmount = Math.round(nutrition.nutrients[0].amount);
    const proteinAmount = Math.round(nutrition.nutrients[8].amount);
    const fatAmount = Math.round(nutrition.nutrients[1].amount);
    const carbsAmount = Math.round(nutrition.nutrients[3].amount);
    const sodiumAmount = Math.round(nutrition.nutrients[7].amount);

    const instructions =
      analyzedInstructions && analyzedInstructions.length > 0
        ? analyzedInstructions[0].steps.map((step) => step.step)
        : ["Instructions are available on the Recipe Page."];
    const ingredients = nutrition.ingredients;
    const summaryText = summary;

    // Create card elements
    const recipeCard = document.createElement("div");
    recipeCard.classList =
      "favorite-recipe-card favorited card m-3 px-0 col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2";
    recipeCard.id = id;

    // Image container
    const imageContainer = document.createElement("div");
    imageContainer.classList =
      "card-image-top d-flex justify-content-center mt-3";

    const img = document.createElement("img");
    img.src = imageURL;
    img.alt = "Recipe Image";
    img.classList = "mb-1 p-0";
    img.width = 240;
    img.height = 180;

    // Delete icon container
    const deleteIconContainer = document.createElement("span");
    deleteIconContainer.id = "delete_container";
    deleteIconContainer.classList =
      "badge badge-light m-1 p-1 border border-danger rounded";

    const deleteIcon = document.createElement("i");
    deleteIcon.classList = "far fa-trash-alt text-danger delete-icon fa-lg";

    deleteIconContainer.appendChild(deleteIcon);
    deleteIconContainer.addEventListener("click", (event) =>
      this.handleDeleteClick(event, id)
    );
    imageContainer.appendChild(deleteIconContainer);
    imageContainer.appendChild(img);

    // Card body
    const cardBody = this.createCardBody(
      title,
      readyInMinutes,
      servings,
      caloriesAmount,
      carbsAmount,
      fatAmount,
      proteinAmount,
      sodiumAmount,
      diets
    );

    // Assemble recipe card
    recipeCard.appendChild(imageContainer);
    recipeCard.appendChild(cardBody);

    // Add event listener for modal
    recipeCard.addEventListener("click", () => {
      this.modalHandler(
        imageURL,
        title,
        sourceUrl,
        id,
        instructions,
        ingredients,
        summaryText
      );
    });

    return recipeCard;
  }
}
