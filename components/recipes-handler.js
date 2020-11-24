const searchResultsQuantityText = document.getElementById("search_results_quantity_text");
const modalContainer = document.getElementById("modal_container");
const resultsShownQuantityText = document.getElementById("results_shown_quantity_text");
const body = document.querySelector("body");
const favoriteButton = document.getElementById("favorite_button");
const backToTopButton = document.getElementById("back_to_top_button");
const recipeInstructions = document.getElementById("recipe_instructions");
const recipeIngredients = document.getElementById("recipe_ingredients");
const modalButtonContainer = document.getElementById("modal_button_container");
const overlayPreview = document.getElementById("overlay_preview");

class RecipesHandler {
  constructor(recipesContainer, favoriteRecipesContainer) {
    this.recipesContainer = recipesContainer;
    this.favoriteRecipesContainer = favoriteRecipesContainer;
    window.addEventListener("scroll", this.handleShowMoreScroll.bind(this));
    backToTopButton.addEventListener(
      "click",
      this.handleBackToTopClick.bind(this)
    );
    this.displaySearchedRecipes = this.displaySearchedRecipes.bind(this);
    this.updateResultsQuantityShown = this.updateResultsQuantityShown.bind(
      this
    );
    this.favoriteCheck = this.favoriteCheck.bind(this);
    overlayPreview.addEventListener("click", this.closePreview.bind(this));
    closePreviewXButton.addEventListener("click", this.closePreview.bind(this));
  }

  clickGetFavoriteRecipes(getFavoriteRecipes) {
    this.getFavoriteRecipes = getFavoriteRecipes;
  }

  chunkSearchedRecipes(recipes) {
    recipeInformation = recipes;
    if (!recipes.results[0]) {
      searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
      searchRecipesDownloadText.className = "d-none";
      noSearchRecipesText.className = "text-center mt-3";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
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
      resultsShownQuantityDiv.className =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  chunkRandomRecipes(recipes) {
    recipeInformation = recipes;
    if (!recipes.results[0]) {
      searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
      searchRecipesDownloadText.className = "d-none";
      noSearchRecipesText.className = "text-center mt-3";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.remove("no-click");
      }
      return;
    }
    searchResultsQuantityDiv.className = "d-flex justify-content-center mt-3";
    searchResultsQuantityText.textContent = `${recipes.results.length} random recipes found`;
    let a = 0;
    while (a < recipes.results.length) {
      chunkedRecipeArray.push(recipes.results.slice(a, a + 12));
      a = a + 12;
    }
    this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
    if (recipes.results.length > 12) {
      resultsShownQuantityDiv.className =
        "d-flex flex-column align-items-center justify-content-center mb-3";
    }
    this.updateResultsQuantityShown();
  }

  handleShowMoreScroll() {
    if (document.documentElement.scrollTop + window.innerHeight === document.documentElement.scrollHeight) {
      if (chunkedRecipeArrayIndex !== chunkedRecipeArray.length - 1) {
        let yPosition = window.scrollY;
        chunkedRecipeArrayIndex++;
        this.displaySearchedRecipes(chunkedRecipeArray, chunkedRecipeArrayIndex);
        window.scroll(0, yPosition);
        this.updateResultsQuantityShown();
      }
    }
  }

  handleBackToTopClick() {
    window.scroll(0, 0);
  }

  updateResultsQuantityShown() {
    resultsShownQuantityText.textContent = `Showing ${
      document.querySelectorAll(".recipe-card").length
    } of ${searchResultsQuantityText.textContent.substring(0, 3)}`;
  }

  handleFavoriteClick(id) {
    event.stopPropagation();
    let heartIcon = document.getElementById(`heart_icon_${id}`);
    let recipeTitle = heartIcon.parentNode.parentNode.parentNode.lastChild.firstChild.firstChild.firstChild.textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    if (!favoriteArray.includes(id)) {
      favoriteArray.push(id);
      heartIcon.className = "fas fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.className =
        "recipe-card favorited card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      Toastify({
        text: `${twoWords}... added`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      heartIcon.className = "far fa-heart text-danger heart-icon fa-lg";
      heartIcon.parentNode.parentNode.parentNode.className =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      Toastify({
        text: `${twoWords}... removed`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
    }
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  }

  handleDeleteClick(id) {
    event.stopPropagation();
    let deleteCard = document.getElementById(`${id}`);
    let recipeTitle =
      deleteCard.firstChild.nextSibling.firstChild.firstChild.firstChild
        .textContent;
    let twoWords = recipeTitle.split(" ").slice(0, 2).join(" ");
    favoriteArray.splice(favoriteArray.indexOf(id), 1);
    document.getElementById(`${id}`).remove();
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
    if (localStorage.getItem("favoriteArray") === "[]") {
      emptyFavoriteTextContainer.className = "d-flex justify-content-center";
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    if (
      favoriteRecipesSection.scrollHeight > favoriteRecipesSection.clientHeight
    ) {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
          Toastify({
            text: `${twoWords}... removed`,
            duration: 1500,
            newWindow: true,
            gravity: "bottom",
            position: "left",
          }).showToast();
    this.favoriteCheck(id);
  }

  handleFavoriteButtonClick(id) {
    const favoriteButton = document.getElementById("favorite_button");
    let recipeTitle = document.getElementById("recipe_title").textContent;
    let twoWords = recipeTitle.split(" ").slice(2, 4).join(" ");
    if (favoriteArray.includes(id) === false) {
      favoriteArray.push(id);
      favoriteButton.className = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
      Toastify({
        text: `${twoWords}... added`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).className =
          "fas fa-heart text-danger heart-icon fa-lg";
      }
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      if (
        favoriteRecipesSection.classList.contains("favorite-recipes-visible")
      ) {
        this.getFavoriteRecipes();
        spoonacularFavoriteError.className = "d-none";
        spoonacularFavoriteTimeoutError.className = "d-none";
      }
      return;
    } else {
      favoriteArray.splice(favoriteArray.indexOf(id), 1);
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      favoriteButton.className = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
      if (document.getElementById(`heart_icon_${id}`)) {
        document.getElementById(`heart_icon_${id}`).className =
          "far fa-heart text-danger heart-icon fa-lg";
      }
      if (document.getElementById(`${id}`)) {
        document.getElementById(`${id}`).remove();
      }
      if (
        favoriteRecipesSection.scrollHeight >
          favoriteRecipesSection.clientHeight &&
        favoriteRecipesSection.classList.contains("favorite-recipes-visible")
      ) {
        favoriteRecipesSection.className =
          "favorite-recipes-visible d-flex flex-column justify-content-start";
      } else {
        favoriteRecipesSection.className =
          "favorite-recipes-visible d-flex flex-column justify-content-center";
      }
      localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      if (
        !localStorage.getItem("favoriteArray") ||
        localStorage.getItem("favoriteArray") === "[]"
      ) {
        emptyFavoriteTextContainer.className = "d-flex justify-content-center";
        return;
      }
      Toastify({
        text: `${twoWords}... removed`,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "left",
      }).showToast();
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
    for (var i = 0; i < searchedArray.length; i++) {
      if (
        favoriteArrayToCheck.includes(
          parseInt(searchedArray[i].id.substring(11))
        )
      ) {
        searchedArray[i].className =
          "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        searchedArray[i].className =
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
    overlayPreview.className = "";
    externalLinkButton.id = "external_link_button";
    externalLinkButton.className = "btn btn-primary text-white";
    externalLinkButton.textContent = "Recipe Page";
    const favoriteButton = document.createElement("button");
    favoriteButton.id = "favorite_button";
    // const closePreviewButton = document.createElement("button");
    // closePreviewButton.id = "go_back_button";
    // closePreviewButton.className = "btn btn-secondary";
    // closePreviewButton.textContent = "Close Preview";
    closePreviewXButton.className = "close-preview-x-button-visible justify-content-center align-items-center text-danger p-0 m-0";
    modalButtonContainer.append(externalLinkButton);
    modalButtonContainer.append(favoriteButton);
    // modalButtonContainer.append(closePreviewButton);
    for (var x = 0; x < ingredients.length; x++) {
      const ingredient = document.createElement("li");
      ingredient.textContent = `${ingredients[x].amount} ${ingredients[x].unit} ${ingredients[x].name}`;
      recipeIngredients.append(ingredient);
    }
    const cleanSummary = DOMPurify.sanitize(summary);
    modalContainer.className =
      "modal-dialog modal-lg modal-dialog-centered rounded d-flex justify-content-center m-0";
    recipeTitle.textContent = `Recipe Preview: ${title}`;
    recipeImage.src = imageURL;
    recipeSummary.innerHTML = cleanSummary;
    body.className = "bg-light freeze";
    externalLinkButton.addEventListener("click", () => {
      window.open(recipeURL, "_blank");
    });
    favoriteButton.addEventListener(
      "click",
      this.handleFavoriteButtonClick.bind(this, id)
    );
    if (favoriteArray.includes(id)) {
      favoriteButton.className = "btn btn-danger";
      favoriteButton.textContent = "Remove from Favorites";
    } else {
      favoriteButton.className = "btn btn-outline-danger";
      favoriteButton.textContent = "Save to Favorites";
    }
    // closePreviewButton.addEventListener("click", this.closePreview.bind(this));
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i] === "var article") {
        return;
      }
      const step = document.createElement("li");
      step.textContent = instructions[i];
      recipeInstructions.append(step);
    }
  }

  closePreview() {
    event.stopPropagation();
    document.querySelector(".modal-body").scrollTo({
      top: 0,
      behavior: "auto",
    });
    modalContainer.className = "d-none justify-content-center";
    body.className = "bg-light";
    overlayPreview.className = "d-none";
    while (recipeInstructions.firstChild) {
      recipeInstructions.removeChild(recipeInstructions.firstChild);
    }
    while (recipeIngredients.firstChild) {
      recipeIngredients.removeChild(recipeIngredients.firstChild);
    }
    while (modalButtonContainer.firstChild) {
      modalButtonContainer.removeChild(modalButtonContainer.firstChild);
    }
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
          .length
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
      recipeCard.className =
        "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100";
      recipeCard.id = "recipe";
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.className = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.className =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.className = "mb-1 p-0";
      img.width = "240";
      img.height = "180";
      const heartIconContainer = document.createElement("span");
      heartIconContainer.id = "heart_container";
      heartIconContainer.className =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const heartIcon = document.createElement("i");
      heartIcon.id = `heart_icon_${id}`;
      if (favoriteArray.includes(id)) {
        heartIcon.className = "fas fa-heart text-danger heart-icon fa-lg";
      } else {
        heartIcon.className = "far fa-heart text-danger heart-icon fa-lg";
      }
      heartIconContainer.append(heartIcon);
      imageContainer.append(heartIconContainer);
      heartIconContainer.addEventListener(
        "click",
        this.handleFavoriteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.className = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
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
      calorieSpan.className = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
      const sodiumSpan = document.createElement("span");
      sodiumSpan.className = "badge badge-secondary mb-1 mr-1";
      sodiumSpan.textContent = `${sodiumAmount}mg Sodium`;
      const cardText3 = document.createElement("div");
      cardText3.className = "card-text d-flex flex-wrap";
      let dietSpan;
      if (chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets) {
        for (
          var j = 0;
          j < chunkedRecipeArray[chunkedRecipeArrayIndex][i].diets.length;
          j++
        ) {
          dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
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
      this.recipesContainer.append(recipeCard);
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
    searchRecipesDownloadProgress.className = "recipe-progress-hidden mt-3";
    searchRecipesDownloadText.className = "d-none";
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.remove("no-click");
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
      recipeCard.className = "favorite-recipe-card favorited card m-3 px-0 col-12";
      recipeCard.id = id;
      const imageContainer = document.createElement("div");
      const titleAnchorTag = document.createElement("a");
      imageContainer.className = "d-flex justify-content-center";
      const img = document.createElement("img");
      imageContainer.className =
        "card-image-top d-flex justify-content-center mt-3";
      img.src = imageURL;
      img.alt = "Recipe Image";
      img.className = "m-0 p-0";
      img.width = "180";
      img.height = "135";
      const deleteIconContainer = document.createElement("span");
      deleteIconContainer.id = "delete_container";
      deleteIconContainer.className =
        "badge badge-light m-1 p-1 border border-danger rounded";
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "far fa-trash-alt text-danger delete-icon fa-lg";
      deleteIconContainer.append(deleteIcon);
      imageContainer.append(deleteIconContainer);
      deleteIconContainer.addEventListener(
        "click",
        this.handleDeleteClick.bind(this, id, event)
      );
      const cardBody = document.createElement("div");
      cardBody.className = "card-body py-0 mb-2";
      const cardTitle = document.createElement("div");
      cardTitle.className = "card-title mb-2";
      const recipeTitle = document.createElement("h5");
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
      calorieSpan.className = "badge badge-secondary mb-1 mr-1";
      calorieSpan.textContent = `${caloriesAmount} Calories`;
      const carbsSpan = document.createElement("span");
      carbsSpan.className = "badge badge-secondary mb-1 mr-1";
      carbsSpan.textContent = `${carbsAmount}g Carbs`;
      const fatSpan = document.createElement("span");
      fatSpan.className = "badge badge-secondary mb-1 mr-1";
      fatSpan.textContent = `${fatAmount}g Total Fat`;
      const proteinSpan = document.createElement("span");
      proteinSpan.className = "badge badge-secondary mb-1 mr-1";
      proteinSpan.textContent = `${proteinAmount}g Protein`;
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
      favoriteRecipesSection.scrollHeight > favoriteRecipesSection.clientHeight
    ) {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-start";
    } else {
      favoriteRecipesSection.className =
        "favorite-recipes-visible d-flex flex-column justify-content-center";
    }
    favoriteRecipesStatusText.className = "text-center d-none";
    favoriteRecipesDownloadProgress.className = "recipe-progress-hidden";
    emptyFavoriteTextContainer.className = "d-none";
  }
}
