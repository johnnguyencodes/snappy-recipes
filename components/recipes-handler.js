const searchResultsQuantityText = document.getElementById("search_results_quantity_text");
const modalContainer = document.getElementById("modal_container");
const resultsShownQuantityText = document.getElementById("results_shown_quantity_text");
const body = document.querySelector("body");
const favoriteButton = document.getElementById("favorite_button");

class RecipesHandler {
  constructor(recipesContainer, favoriteRecipesContainer) {
    this.recipesContainer = recipesContainer;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    showMoreButton.addEventListener("click", this.handleShowMoreClick.bind(this));
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown = this.updateResultsQuantityShown.bind(this);
    this.favoriteCheck = this.favoriteCheck.bind(this);
  }

  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkSearchedRecipes(recipes) {
    console.log(recipes);
    recipeInformation = recipes;
    if (!(recipes.results[0])) {
      searchRecipesDownloadText.className = "d-none";
      noSearchRecipesText.className = "text-center mt-3";
      return;
    }
    searchResultsQuantityDiv.className = "d-flex justify-content-center mt-3";
    searchResultsQuantityText.textContent = `${recipes.results.length} recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      chunkedRecipeArray.push(recipes.results.slice(a, a + 12));
      a = a + 12;
    }
    this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
    if (recipes.results.length > 12) {
      resultsShownQuantityDiv.className = "d-flex flex-column align-items-center justify-content-center mb-3"
    }
    this.updateResultsQuantityShown();
  }

  handleShowMoreClick() {
    let yPosition = window.scrollY;
    chunkedRecipeArrayIndex++;
    this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
    window.scroll(0, yPosition);
    if (chunkedRecipeArrayIndex === chunkedRecipeArray.length - 1) {
      showMoreButton.className = "d-none"
    }
    this.updateResultsQuantityShown();
  }

  updateResultsQuantityShown() {
    resultsShownQuantityText.textContent = `Showing ${document.querySelectorAll(".recipe-card").length} of ${searchResultsQuantityText.textContent.substring(0, searchResultsQuantityText.textContent.length - 14)}`
  }

  handleFavoriteClick(id) {
    if (!(favoriteArray.includes(id))) {
      favoriteArray.push(id);
      document.getElementById(`heart_icon_${id}`).className = "fas fa-heart text-danger heart-icon fa-lg";
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      document.getElementById(`heart_icon_${id}`).className = "far fa-heart text-danger heart-icon fa-lg";
    }
    localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
    this.getFavoriteRecipes();
  }

  handleFavoriteButtonClick(id) {
    if (!(favoriteArray.includes(id))) {
      favoriteArray.push(id);
      favoriteButton.className = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
      document.getElementById(`heart_icon_${id}`).className = "fas fa-heart text-danger heart-icon fa-lg";
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      favoriteButton.className = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      document.getElementById(`heart_icon_${id}`).className = "far fa-heart text-danger heart-icon fa-lg";
    }
    localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
    this.getFavoriteRecipes();
  }

  handleDeleteClick(id) {
    favoriteArray.splice(favoriteArray.indexOf(id), 1);
    document.getElementById(`${id}`).remove();
    localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
    if (localStorage.getItem('favoriteArray') === "[]") {
      emptyFavoriteTextContainer.className = "d-flex justify-content-center";
    }
    this.favoriteCheck();
  }

  favoriteCheck() {
    if (!(localStorage.getItem('favoriteArray'))) {
      return;
    }
    let searchedArray = document.querySelectorAll("#heart_container i");
    let favoriteArrayToCheck = JSON.parse(localStorage.getItem("favoriteArray"));
    for (var i = 0; i < searchedArray.length; i++) {
      if (favoriteArrayToCheck.includes(parseInt(searchedArray[i].id.substring(11)))) {
        searchedArray[i].className = "fas fa-heart text-danger heart-icon fa-lg";
        favoriteButton.className = "btn btn-danger";
        favoriteButton.textContent = "Remove from Favorites";
      } else {
        searchedArray[i].className = "far fa-heart text-danger heart-icon fa-lg";
        favoriteButton.className = "btn btn-outline-danger";
        favoriteButton.textContent = "Save to Favorites";
      }
    }
  }

  modalHandler(imageURL, title, recipeURL, id, instructions, ingredients, summary, cardText1,
    cardText2, cardText3) {
    const recipeBody = document.getElementById("recipe_body");
    const recipeTitle = document.getElementById("recipe_title");
    const recipeImage = document.getElementById("recipe_image");
    const recipeSummary = document.getElementById("recipe_summary");
    const recipeInstructions = document.getElementById("recipe_instructions");
    const favoriteButton = document.getElementById("favorite_button");
    const recipeIngredients = document.getElementById("recipe_ingredients");
    const recipeGlance = document.getElementById("recipe_at_a_glance");
    const cleanSummary = DOMPurify.sanitize(summary);
    modalContainer.className = "";
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = cleanSummary;
    body.className = "bg-light freeze";
    document.getElementById("external_link_button").addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });
    document.getElementById("go_back_button").addEventListener("click", () => {
      document.querySelector(".modal-body").scrollTo({
        top: 0,
        behavior: "auto"
      });
      modalContainer.className = "d-none";
      body.className = "bg-light";
      while (recipeInstructions.firstChild) {
        recipeInstructions.removeChild(recipeInstructions.firstChild);
      }
      while (recipeIngredients.firstChild) {
        recipeIngredients.removeChild(recipeIngredients.firstChild);
      }
      while (recipeGlance.firstChild) {
        recipeGlance.removeChild(recipeGlance.firstChild);
      }
    });
    favoriteButton.addEventListener("click", this.handleFavoriteButtonClick.bind(this, id));
    this.favoriteCheck();
    for (var x = 0; x < ingredients.length; x++) {
      const ingredient = document.createElement("li");
      ingredient.textContent = `${ingredients[x].amount} ${ingredients[x].unit} ${ingredients[x].name}`
      recipeIngredients.append(ingredient);
    }
    let recipeCardText1 = cardText1.cloneNode(true);
    let recipeCardText2 = cardText2.cloneNode(true);
    let recipeCardText3 = cardText3.cloneNode(true);
    recipeGlance.append(recipeCardText1);
    recipeGlance.append(recipeCardText2);
    recipeGlance.append(recipeCardText3);
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i] === "var article") {
        return;
      }
      const step = document.createElement("li");
      step.textContent = instructions[i];
      recipeInstructions.append(step);
    }
  }

  displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex) {
    for (let i = 0; i < chunkedRecipeArray[chunkedRecipeArrayIndex].length; i++) {
      const imageURL = `${chunkedRecipeArray[chunkedRecipeArrayIndex][i].image.substring(0, chunkedRecipeArray[chunkedRecipeArrayIndex][i].image.length - 11)}480x360.jpg`;
      const title = chunkedRecipeArray[chunkedRecipeArrayIndex][i].title;
      const readyInMinutes = chunkedRecipeArray[chunkedRecipeArrayIndex][i].readyInMinutes;
      const servings = chunkedRecipeArray[chunkedRecipeArrayIndex][i].servings;
      const recipeURL = chunkedRecipeArray[chunkedRecipeArrayIndex][i].sourceUrl;
      const caloriesAmount = Math.round(chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[0].amount);
      const proteinAmount = Math.round(chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[8].amount);
      const fatAmount = Math.round(chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.nutrients[7].amount);
      const id = chunkedRecipeArray[chunkedRecipeArrayIndex][i].id;
      let instructions = [];
      if (!(chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions.length)) {
        instructions.push("Instructions are available on the Recipe Page.");
      } else {
        for (let k = 0; k < chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions[0].steps.length; k++) {
          instructions.push(chunkedRecipeArray[chunkedRecipeArrayIndex][i].analyzedInstructions[0].steps[k].step);
        }
      }
      const ingredients = chunkedRecipeArray[chunkedRecipeArrayIndex][i].nutrition.ingredients;
      const summary = chunkedRecipeArray[chunkedRecipeArrayIndex][i].summary;
      const recipeCard = document.createElement("div");
      recipeCard.className = "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      recipeCard.id = "recipe";
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.className = "d-flex justify-content-center"
      const img = document.createElement("img");
      imageContainer.className = "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.className = "mb-1 p-0";
      const heartIconContainer = document.createElement("span");
      heartIconContainer.id = "heart_container";
      heartIconContainer.className = "badge badge-light m-1 p-1 border border-danger rounded";
      const heartIcon = document.createElement("i");
      heartIcon.id = `heart_icon_${id}`;
      if (favoriteArray.includes(id)) {
        heartIcon.className = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        heartIcon.className = "far fa-heart text-danger heart-icon fa-lg";
      }
      heartIconContainer.append(heartIcon);
      imageContainer.append(heartIconContainer);
      heartIconContainer.addEventListener("click", this.handleFavoriteClick.bind(this, id));
      const cardBody = document.createElement("div");
      cardBody.className = "card-body py-0";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title mb-0";
      const recipeTitle = document.createElement("h3");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.className = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.className = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.className = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.className = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.className = "badge badge-secondary mb-1 mr-1"
      calorieSpan.textContent = `${caloriesAmount} Calories`
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1"
      carbsSpan.textContent = `${carbsAmount}g Carbs`
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1"
      fatSpan.textContent = `${fatAmount}g Total Fat`
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`
      const sodiumSpan = document.createElement("span");
      sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.className = "card-text d-flex flex-wrap";
      let dietSpan;
      if (chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets) {
        for (var j = 0; j < chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets.length; j++) {
          dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
          dietSpan.textContent = chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets[j];
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
      cardTitle.append(cardText1);
      cardTitle.append(cardText3);
      cardTitle.append(cardText2);
      cardBody.append(cardTitle);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.recipesContainer.append(recipeCard);
      titleAnchorTag.addEventListener("click", this.modalHandler.bind(this, imageURL,
        title, recipeURL, id, instructions, ingredients, summary, cardText1,
        cardText2, cardText3));
    }
    searchRecipesDownloadText.className = "d-none";
  }

  displayFavoriteRecipes(recipes) {
    for (let i = 0; i < recipes.length; i++) {
      const imageURL = `${recipes[i].image.substring(0, recipes[i].image.length - 11)}556x370.jpg`;
      const title = recipes[i].title;
      const readyInMinutes = recipes[i].readyInMinutes;
      const servings = recipes[i].servings;
      const recipeURL = recipes[i].sourceUrl;
      const caloriesAmount = Math.round(recipes[i].nutrition.nutrients[0].amount);
      const proteinAmount = Math.round(recipes[i].nutrition.nutrients[8].amount);
      const fatAmount = Math.round(recipes[i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(recipes[i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(recipes[i].nutrition.nutrients[7].amount);
      const id = recipes[i].id;
      const recipeCard = document.createElement("div");
      recipeCard.className = "favorite-recipe-card card mx-3 my-4 pt-3 col-11";
      recipeCard.id = id;
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      titleAnchorTag.addEventListener("click", this.modalHandler.bind(this, recipeURL));
      imageContainer.className = "d-flex justify-content-center"
      const img = document.createElement("img");
      imageContainer.className = "card-image-top d-flex justify-content-center";
      img.src = imageURL;
      img.alt = "Recipe Image"
      img.className = "m-0 p-0";
      const deleteIconContainer = document.createElement("span");
      deleteIconContainer.id = "delete_container";
      deleteIconContainer.className = "badge badge-light m-1 p-1 border border-danger rounded";
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "far fa-trash-alt text-danger delete-icon fa-lg";
      deleteIconContainer.append(deleteIcon);
      imageContainer.append(deleteIconContainer);
      deleteIconContainer.addEventListener("click", this.handleDeleteClick.bind(this, id));
      const cardBody = document.createElement("div");
      cardBody.className = "card-body p-0 m-0";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title";
      const recipeTitle = document.createElement("h3");
      recipeTitle.textContent = title;
      const cardText1 = document.createElement("div");
      cardText1.className = "card-text";
      const minutesSpan = document.createElement("span");
      minutesSpan.className = "badge badge-dark mr-1 mb-1";
      minutesSpan.textContent = `${readyInMinutes} Minutes`;
      const servingsSpan = document.createElement("span");
      servingsSpan.className = "badge badge-dark mb-1";
      servingsSpan.textContent = `${servings} Servings`;
      cardText1.append(minutesSpan);
      cardText1.append(servingsSpan);
      const cardText2 = document.createElement("div");
      cardText2.className = "card-text d-flex flex-wrap";
      const calorieSpan = document.createElement("span");
      calorieSpan.className = "badge badge-secondary mb-1 mr-1"
      calorieSpan.textContent = `${caloriesAmount} Calories`
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1"
      carbsSpan.textContent = `${carbsAmount}g Carbs`
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1"
      fatSpan.textContent = `${fatAmount}g Total Fat`
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`
      const sodiumSpan = document.createElement("span");
      sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.className = "card=text d-flex flex-wrap";
      if (recipes[i].diets) {
        for (var j = 0; j < recipes[i].diets.length; j++) {
          const dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
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
      cardTitle.append(cardText1);
      cardTitle.append(cardText3);
      cardTitle.append(cardText2);
      cardBody.append(cardTitle);
      imageContainer.append(img);
      recipeCard.append(imageContainer);
      recipeCard.append(cardBody);
      this.favoriteRecipesContainer.append(recipeCard);
    }
    favoriteRecipesStatusText.className = "text-center d-none";
  }
}
