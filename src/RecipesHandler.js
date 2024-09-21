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
    window.addEventListener("scroll", this.handleShowMoreScroll.bind(this));
    this.domManager.recipes.backToTopButton.addEventListener(
      "click",
      this.handleBackToTopClick
    );
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown =
      this.updateResultsQuantityShown.bind(this);
    this.favoriteCheck = this.favoriteCheck.bind(this);
    this.domManager.recipes.modalContainer.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
    this.domManager.app.closePreviewXButton.addEventListener(
      "click",
      this.closePreview.bind(this, event)
    );
  }
  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkSearchedRecipes(recipes) {
    this.domManager.app.recipeInformation = recipes;
    if (!recipes.results[0]) {
      this.domManager.app.searchRecipesDownloadProgress.classList =
        "recipe-progress-hidden mt-3";
      this.domManager.app.searchRecipesDownloadText.classList = "d-none";
      this.domManager.app.noSearchRecipesText.classList = "text-center mt-3";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    this.domManager.app.searchResultsQuantityDiv.classList =
      "d-flex justify-content-center mt-3";
    this.domManager.recipes.searchResultsQuantityText.textContent = `${recipes.results.length} recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      const tempRecipeArray =
        this.appStateManager.getState("chunkedRecipeArray");
      tempRecipeArray.push(recipes.results.slice(a, a + 12));
      this.appStateManager.setState("chunkedRecipeArray", tempRecipeArray);
      a = a + 12;
    }
    this.displaySearchedRecipes(
      this.appStateManager.getState("chunkedRecipeArray"),
      this.appStateManager.getState("chunkedRecipeArrayIndex")
    );
    if (recipes.results.length > 12) {
      this.domManager.app.resultsShownQuantityDiv.classList =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  chunkRandomRecipes(recipes) {
    this.domManager.app.recipeInformation = recipes;
    if (!recipes.results[0]) {
      this.domManager.app.searchRecipesDownloadProgress.classList =
        "recipe-progress-hidden mt-3";
      this.domManager.app.searchRecipesDownloadText.classList = "d-none";
      this.domManager.app.noSearchRecipesText.classList = "text-center mt-3";
      for (let i = 0; i < this.domManager.app.inputs.length; i++) {
        this.domManager.app.inputs[i].disabled = false;
        this.domManager.app.inputs[i].classList.remove("no-click");
      }
      return;
    }
    this.domManager.app.searchResultsQuantityDiv.classList =
      "d-flex justify-content-center mt-3";
    this.domManager.recipes.searchResultsQuantityText.textContent = `${recipes.results.length} random recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      const tempRecipeArray =
        this.appStateManager.getState("chunkedRecipeArray");
      tempRecipeArray.push(recipes.results.slice(a, a + 12));
      this.appStateManager.setState("chunkedRecipeArray", tempRecipeArray);
      a = a + 12;
    }
    this.displaySearchedRecipes(
      this.appStateManager.getState("chunkedRecipeArray"),
      this.appStateManager.getState("chunkedRecipeArrayIndex")
    );
    if (recipes.results.length > 12) {
      this.domManager.app.resultsShownQuantityDiv.classList =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  handleShowMoreScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      if (
        this.appStateManager.getState("chunkedRecipeArrayIndex") !==
        this.appStateManager.getState("chunkedRecipeArray").length - 1
      ) {
        let yPosition = window.scrollY;
        this.appStateManager.setState(
          "chunkedRecipeArrayIndex",
          this.appStateManager.getState("chunkedRecipeArrayIndex") + 1
        );
        this.displaySearchedRecipes(
          this.appStateManager.getState("chunkedRecipeArray"),
          this.appStateManager.getState("chunkedRecipeArrayIndex")
        );
        window.scroll(0, yPosition);
        this.updateResultsQuantityShown();
      }
    }
  }

  handleBackToTopClick() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  updateResultsQuantityShown() {
    this.domManager.recipes.resultsShownQuantityText.textContent = `Showing ${
      document.querySelectorAll(".recipe-card").length
    } of ${this.domManager.recipes.searchResultsQuantityText.textContent.substring(0, 3)}`;
  }

  handleFavoriteClick(id) {
    event.stopPropagation();
    let heartIcon = document.getElementById(`heart_icon_${id}`);
    let recipeTitle =
      heartIcon.parentNode.parentNode.parentNode.lastChild.firstChild.firstChild
        .firstChild.textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    if (!this.appStateManager.getState("favoriteArray").includes(id)) {
      this.appStateManager.setState("favoriteArray", [
        ...this.appStateManager.getState("favoriteArray"),
        id,
      ]);
      heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.classList =
        "recipe-card favorited card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      // Toastify({
      //   text: `${twoWords}... added`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    } else {
      const tempArray = this.appStateManager.getState("favoriteArray");
      const index = this.appStateManager.getState("favoriteArray").indexOf(id);
      if (index !== -1) {
        tempArray.splice(index, 1);
        this.appStateManager.setState("favoriteArray", tempArray);
      }
      heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.classList =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      // Toastify({
      //   text: `${twoWords}... removed`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    }
    localStorage.setItem(
      "favoriteArray",
      JSON.stringify(this.appStateManager.getState("favoriteArray"))
    );
  }

  handleDeleteClick(id) {
    event.stopPropagation();
    let deleteCard = document.getElementById(`${id}`);
    let recipeTitle =
      deleteCard.firstChild.nextSibling.firstChild.firstChild.firstChild
        .textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    const tempArray = this.appStateManager.getState("favoriteArray");
    const index = this.appStateManager.getState("favoriteArray").indexOf(id);
    if (index !== -1) {
      tempArray.splice(index, 1);
      this.appStateManager.setState("favoriteArray", tempArray);
    }
    document.getElementById(`${id}`).remove();
    localStorage.setItem(
      "favoriteArray",
      JSON.stringify(this.appStateManager.getState("favoriteArray"))
    );
    if (localStorage.getItem("favoriteArray") === "[]") {
      this.domManager.app.emptyFavoriteTextContainer.classList =
        "d-flex justify-content-center";
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    if (
      this.domManager.app.favoriteRecipesSection.scrollHeight >
      this.domManager.app.favoriteRecipesSection.clientHeight
    ) {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    // Toastify({
    //   text: `${twoWords}... removed`,
    //   duration: 1500,
    //   newWindow: true,
    //   gravity: "bottom",
    //   position: "left",
    // }).showToast();
    this.favoriteCheck(id);
  }

  handleFavoriteButtonClick(id) {
    event.stopPropagation();
    const favoriteButton = document.getElementById("favorite_button");
    let recipeTitle = document.getElementById("recipe_title").textContent;
    let twoWords = recipeTitle.split(" ").slice(2, 4).join(" ");
    if (!this.appStateManager.getState("favoriteArray").includes(id)) {
      this.appStateManager.setState("favoriteArray", [
        ...this.appStateManager.getState("favoriteArray"),
        id,
      ]);
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
      // Toastify({
      //   text: `${twoWords}... added`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).classList =
          "fas fa-heart text-danger heart-icon fa-lg";
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      if (
        this.domManager.app.favoriteRecipesSection.classList.contains(
          "favorite-recipes-visible"
        )
      ) {
        this.getFavoriteRecipes();
        this.domManager.app.spoonacularFavoriteError.classList = "d-none";
        this.domManager.app.spoonacularFavoriteTimeoutError.classList =
          "d-none";
      }
      return;
    } else {
      const tempArray = this.appStateManager.getState("favoriteArray");
      const index = this.appStateManager.getState("favoriteArray").indexOf(id);
      if (index !== -1) {
        tempArray.splice(index, 1);
        this.appStateManager.setState("favoriteArray", tempArray);
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).classList =
          "far fa-heart text-danger heart-icon fa-lg";
      }
      if (document.getElementById(`${id}`)) {
        document.getElementById(`${id}`).remove();
      }
      if (
        this.domManager.app.favoriteRecipesSection.scrollHeight >
          this.domManager.app.favoriteRecipesSection.clientHeight &&
        this.domManager.app.favoriteRecipesSection.classList.contains(
          "favorite-recipes-visible"
        )
      ) {
        this.domManager.app.favoriteRecipesSection.classList =
          "favorite-recipes-visible d-flex flex-column justify-content-start";
      } else {
        this.domManager.app.favoriteRecipesSection.classList =
          "favorite-recipes-visible d-flex flex-column justify-content-center";
      }
      localStorage.setItem(
        "favoriteArray",
        JSON.stringify(this.appStateManager.getState("favoriteArray"))
      );
      if (
        !localStorage.getItem("favoriteArray") ||
        localStorage.getItem("favoriteArray") === "[]"
      ) {
        this.domManager.app.emptyFavoriteTextContainer.classList =
          "d-flex justify-content-center";
        return;
      }
      // Toastify({
      //   text: `${twoWords}... removed`,
      //   duration: 1500,
      //   newWindow: true,
      //   gravity: "bottom",
      //   position: "left",
      // }).showToast();
    }
  }

  favoriteCheck() {
    if (!localStorage.getItem("favoriteArray")) {
      return;
    }
    let searchedArray = document.querySelectorAll("#heart_container i");
    let favoriteArrayToCheck = JSON.parse(
      localStorage.getItem("favoriteArray")
    );
    for (let i = 0; i < searchedArray.length; i++) {
      if (
        favoriteArrayToCheck.includes(
          parseInt(searchedArray[i].id.substring(11))
        )
      ) {
        searchedArray[i].classList =
          "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        searchedArray[i].classList =
          "far fa-heart text-danger heart-icon fa-lg";
      }
    }
  }

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
    const recipeBody = document.getElementById("recipe_body");
    const recipeTitle = document.getElementById("recipe_title");
    const recipeImage = document.getElementById("recipe_image");
    const recipeSummary = document.getElementById("recipe_summary");
    const externalLinkButton = document.createElement("button");
    this.domManager.recipes.overlayPreview.classList = "";
    externalLinkButton.id = "external_link_button";
    externalLinkButton.classList = "btn btn-primary text-white";
    externalLinkButton.textContent = "Recipe Page";
    const favoriteButton = document.createElement("button");
    favoriteButton.id = "favorite_button";
    // const closePreviewButton = document.createElement("button");
    // closePreviewButton.id = "go_back_button";
    // closePreviewButton.classList = "btn btn-secondary";
    // closePreviewButton.textContent = "Close Preview";
    this.domManager.app.closePreviewXButton.classList =
      "close-preview-x-button-visible justify-content-center align-items-center text-danger p-0 m-0";
    this.domManager.recipes.modalButtonContainer.append(externalLinkButton);
    this.domManager.recipes.modalButtonContainer.append(favoriteButton);
    // this.domManager.recipes.modalButtonContainer.append(closePreviewButton);
    for (let x = 0; x < ingredients.length; x++) {
      const ingredient = document.createElement("li");
      ingredient.textContent = `${ingredients[x].amount} ${ingredients[x].unit} ${ingredients[x].name}`;
      this.domManager.recipes.recipeIngredients.append(ingredient);
    }
    const cleanSummary = DOMPurify.sanitize(summary);
    this.domManager.recipes.modalContainer.classList = "";
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = cleanSummary;
    this.domManager.recipes.body.classList = "bg-light freeze";
    externalLinkButton.addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });
    favoriteButton.addEventListener(
      "click",
      this.handleFavoriteButtonClick.bind(this, id)
    );
    if (this.appStateManager.getState("favoriteArray").includes(id)) {
      favoriteButton.classList = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
    } else {
      favoriteButton.classList = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
    }
    // closePreviewButton.addEventListener("click", this.closePreview.bind(this));
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i] === "var article") {
        return;
      }
      const step = document.createElement("li");
      step.textContent = instructions[i];
      this.domManager.recipes.recipeInstructions.append(step);
    }
  }

  closePreview() {
    // if (event.target === "<i class="fas fa-window-close fa-2x"></i>" || event.target === )
    if (
      event.target.id === "modal_container" ||
      event.target.id === "close_preview_x_icon"
    ) {
      document.querySelector(".modal-body").scrollTo({
        top: 0,
        behavior: "auto",
      });
      this.domManager.recipes.modalContainer.classList =
        "d-none justify-content-center";
      this.domManager.recipes.body.classList = "bg-light";
      this.domManager.recipes.overlayPreview.classList = "d-none";
      while (this.domManager.recipes.recipeInstructions.firstChild) {
        this.domManager.recipes.recipeInstructions.removeChild(
          this.domManager.recipes.recipeInstructions.firstChild
        );
      }
      while (this.domManager.recipes.recipeIngredients.firstChild) {
        this.domManager.recipes.recipeIngredients.removeChild(
          this.domManager.recipes.recipeIngredients.firstChild
        );
      }
      while (this.domManager.recipes.modalButtonContainer.firstChild) {
        this.domManager.recipes.modalButtonContainer.removeChild(
          this.domManager.recipes.modalButtonContainer.firstChild
        );
      }
    } else return;
  }

  displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex) {
    for (
      let i = 0;
      i < chunkedRecipeArray[chunkedRecipeArrayIndex].length;
      i++
    ) {
      const imageURL = `${chunkedRecipeArray[chunkedRecipeArrayIndex][
        i
      ].image.substring(
        0,
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].image.length - 11
      )}480x360.jpg`;
      const title = chunkedRecipeArray[chunkedRecipeArrayIndex][i].title;
      const readyInMinutes =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].readyInMinutes;
      const servings = chunkedRecipeArray[chunkedRecipeArrayIndex][i].servings;
      const recipeURL =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].sourceUrl;
      const caloriesAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[0]
          .amount
      );
      const proteinAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[8]
          .amount
      );
      const fatAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[1]
          .amount
      );
      const carbsAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[3]
          .amount
      );
      const sodiumAmount = Math.round(
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[7]
          .amount
      );
      const id = chunkedRecipeArray[chunkedRecipeArrayIndex][i].id;
      let instructions = [];
      if (
        !chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions
      ) {
        instructions.push("Instructions are available on the Recipe Page.");
      } else {
        for (
          let k = 0;
          k <
          chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions[0]
            .steps.length;
          k++
        ) {
          instructions.push(
            chunkedRecipeArray[chunkedRecipeArrayIndex][i]
              .analyzedInstructions[0].steps[k].step
          );
        }
      }
      const ingredients =
        chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.ingredients;
      const summary = chunkedRecipeArray[chunkedRecipeArrayIndex][i].summary;
      const recipeCard = document.createElement("div");
      recipeCard.classList =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      recipeCard.id = "recipe";
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.classList = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.classList =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.classList = "mb-1 p-0";
      img.width = "240";
      img.height = "180";
      const heartIconContainer = document.createElement("span");
      heartIconContainer.id = "heart_container";
      heartIconContainer.classList =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const heartIcon = document.createElement("i");
      heartIcon.id = `heart_icon_${id}`;
      if (this.appStateManager.getState("favoriteArray").includes(id)) {
        heartIcon.classList = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        heartIcon.classList = "far fa-heart text-danger heart-icon fa-lg";
      }
      heartIconContainer.append(heartIcon);
      imageContainer.append(heartIconContainer);
      heartIconContainer.addEventListener(
        "click",
        this.handleFavoriteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.classList = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.classList = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.classList = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.classList = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.classList = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.classList = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.classList = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.classList = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.classList = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.classList = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.classList = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.classList = "card-text d-flex flex-wrap";
      let dietSpan;
      if (chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets) {
        for (
          let j = 0;
          j < chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets.length;
          j++
        ) {
          dietSpan = document.createElement("span");
          dietSpan.classList = "badge badge-light mb-1 mr-1";
          dietSpan.textContent =
            chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets[j];
          cardText3.append(dietSpan);
        }
      }
      cardText2.append(calorieSpan);
      cardText2.append(carbsSpan);
      cardText2.append(fatSpan);
      cardText2.append(proteinSpan);
      cardText2.append(sodiumSpan);
      titleAnchorTag.append(recipeTitle);
      cardTitle.append(titleAnchorTag);
      cardBody.append(cardTitle);
      cardBody.append(cardText1);
      cardBody.append(cardText3);
      cardBody.append(cardText2);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.searchRecipesContainer.append(recipeCard);
      recipeCard.addEventListener(
        "click",
        this.modalHandler.bind(
          this,
          imageURL,
          title,
          recipeURL,
          id,
          instructions,
          ingredients,
          summary
        )
      );
    }
    this.domManager.app.searchRecipesDownloadProgress.classList =
      "recipe-progress-hidden mt-3";
    this.domManager.app.searchRecipesDownloadText.classList = "d-none";
    for (let i = 0; i < this.domManager.app.inputs.length; i++) {
      this.domManager.app.inputs[i].disabled = false;
      this.domManager.app.inputs[i].classList.remove("no-click");
    }
  }

  displayFavoriteRecipes(recipes) {
    for (let i = 0; i < recipes.length; i++) {
      let imageURL = null;
      if ("image" in recipes[i]) {
        imageURL = imageURL = `${recipes[i].image.substring(
          0,
          recipes[i].image.length - 11
        )}556x370.jpg`;
      } else {
        imageURL = "https://spoonacular.com/recipeImages/342447-3480x360.jpg";
      }
      const title = recipes[i].title;
      const readyInMinutes = recipes[i].readyInMinutes;
      const servings = recipes[i].servings;
      const recipeURL = recipes[i].sourceUrl;
      const caloriesAmount = Math.round(
        recipes[i].nutrition.nutrients[0].amount
      );
      const proteinAmount = Math.round(
        recipes[i].nutrition.nutrients[8].amount
      );
      const fatAmount = Math.round(recipes[i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(recipes[i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(recipes[i].nutrition.nutrients[7].amount);
      const id = recipes[i].id;
      let instructions = [];
      if (!recipes[i].analyzedInstructions.length) {
        instructions.push("Instructions are available on the Recipe Page.");
      } else {
        for (
          let k = 0;
          k < recipes[i].analyzedInstructions[0].steps.length;
          k++
        ) {
          instructions.push(recipes[i].analyzedInstructions[0].steps[k].step);
        }
      }
      const ingredients = recipes[i].nutrition.ingredients;
      const summary = recipes[i].summary;
      const recipeCard = document.createElement("div");
      recipeCard.classList =
        "favorite-recipe-card favorited card m-3 px-0 col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2";
      recipeCard.id = id;
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.classList = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.classList =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.classList = "m-0 p-0";
      img.width = "240";
      img.height = "180";
      const deleteIconContainer = document.createElement("span");
      deleteIconContainer.id = "delete_container";
      deleteIconContainer.classList =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const deleteIcon = document.createElement("i");
      deleteIcon.classList = "far fa-trash-alt text-danger delete-icon fa-lg";
      deleteIconContainer.append(deleteIcon);
      imageContainer.append(deleteIconContainer);
      deleteIconContainer.addEventListener(
        "click",
        this.handleDeleteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.classList = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.classList = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.classList = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.classList = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.classList = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.classList = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.classList = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.classList = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.classList = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.classList = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.classList = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.classList = "card=text d-flex flex-wrap";
      if (recipes[i].diets) {
        for (let j = 0; j < recipes[i].diets.length; j++) {
          const dietSpan = document.createElement("span");
          dietSpan.classList = "badge badge-light mb-1 mr-1";
          dietSpan.textContent = recipes[i].diets[j];
          cardText3.append(dietSpan);
        }
      }
      cardText2.append(calorieSpan);
      cardText2.append(carbsSpan);
      cardText2.append(fatSpan);
      cardText2.append(proteinSpan);
      cardText2.append(sodiumSpan);
      titleAnchorTag.append(recipeTitle);
      cardTitle.append(titleAnchorTag);
      cardBody.append(cardTitle);
      cardBody.append(cardText1);
      cardBody.append(cardText3);
      cardBody.append(cardText2);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.favoriteRecipesContainer.append(recipeCard);
      recipeCard.addEventListener(
        "click",
        this.modalHandler.bind(
          this,
          imageURL,
          title,
          recipeURL,
          id,
          instructions,
          ingredients,
          summary
        )
      );
    }
    if (
      this.domManager.app.favoriteRecipesSection.scrollHeight >
      this.domManager.app.favoriteRecipesSection.clientHeight
    ) {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      this.domManager.app.favoriteRecipesSection.classList =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    this.domManager.app.favoriteRecipesStatusText.classList =
      "text-center d-none";
    this.domManager.app.favoriteRecipesDownloadProgress.classList =
      "favorite-recipe-progress-hidden";
    this.domManager.app.emptyFavoriteTextContainer.classList = "d-none";
  }
}
