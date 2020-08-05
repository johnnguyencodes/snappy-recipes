class RecipesContainer {
  constructor(recipesContainer, favoritedRecipesContainer) {
    this.recipesContainer = recipesContainer;
    this.favoritedRecipesContainer = favoritedRecipesContainer;
  }

  recipeOnPage(recipes) {
    for (let i = 0; i < recipes.results.length; i++) {
      const imageURL = recipes.results[i].image;
      const title = recipes.results[i].title;
      const readyInMinutes = recipes.results[i].readyInMinutes;
      const servings = recipes.results[i].servings;
      const recipeURL = recipes.results[i].sourceUrl;
      const healthScore = recipes.results[i].healthScore;
      const caloriesAmount = Math.round(recipes.results[i].nutrition.nutrients[0].amount);
      const proteinAmount = Math.round(recipes.results[i].nutrition.nutrients[8].amount);
      const fatAmount = Math.round(recipes.results[i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(recipes.results[i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(recipes.results[i].nutrition.nutrients[7].amount);
      const recipeCard = document.createElement("div");
      recipeCard.className = "recipe-card card mb-5 mx-3 pt-3 col-xs-12";
      recipeCard.id = "recipe";
      const anchorTag = document.createElement("a");
      const titleAnchorTag = document.createElement("a");
      anchorTag.href = recipeURL;
      titleAnchorTag.href = recipeURL;
      anchorTag.className = "stretched-link d-flex justify-content-center"
      const img = document.createElement("img");
      img.className = "card-image-top";
      img.src = imageURL;
      img.alt = "Recipe Image"
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
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
      if (recipes.results[i].diets) {
        for (var j = 0; j < recipes.results[i].diets.length; j++) {
          const dietSpan = document.createElement("span");
          dietSpan.className = "badge badge-light mb-1 mr-1";
          dietSpan.textContent = recipes.results[i].diets[j];
          cardText3.append(dietSpan);
        }
      }
      cardText2.append(calorieSpan);
      cardText2.append(carbsSpan);
      cardText2.append(fatSpan);
      cardText2.append(proteinSpan);
      cardText2.append(sodiumSpan);
      cardTitle.append(recipeTitle);
      cardTitle.append(cardText1);
      cardTitle.append(cardText3);
      cardTitle.append(cardText2);
      cardBody.append(cardTitle);
      anchorTag.append(img);
      recipeCard.append(anchorTag);
      recipeCard.append(cardBody);
      this.recipesContainer.append(recipeCard);
    }
    document.getElementById("recipe_download_text").className = "text-center d-none";
  }

  favoritedRecipesOnPage(recipes) {
    for (let i = 0; i < recipes.length; i++) {
      const imageURL = recipes[i].image;
      const title = recipes[i].title;
      const readyInMinutes = recipes[i].readyInMinutes;
      const servings = recipes[i].servings;
      const recipeURL = recipes[i].sourceUrl;
      const healthScore = recipes[i].healthScore;
      const caloriesAmount = Math.round(recipes[i].nutrition.nutrients[0].amount);
      const proteinAmount = Math.round(recipes[i].nutrition.nutrients[8].amount);
      const fatAmount = Math.round(recipes[i].nutrition.nutrients[1].amount);
      const carbsAmount = Math.round(recipes[i].nutrition.nutrients[3].amount);
      const sodiumAmount = Math.round(recipes[i].nutrition.nutrients[7].amount);
      const recipeCard = document.createElement("div");
      recipeCard.className = "recipe-card card mb-5 mx-3 pt-3 col-xs-12";
      recipeCard.id = "recipe";
      const anchorTag = document.createElement("a");
      const titleAnchorTag = document.createElement("a");
      anchorTag.href = recipeURL;
      titleAnchorTag.href = recipeURL;
      anchorTag.className = "stretched-link d-flex justify-content-center"
      const img = document.createElement("img");
      img.className = "card-image-top";
      img.src = imageURL;
      img.alt = "Recipe Image"
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
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
      cardTitle.append(recipeTitle);
      cardTitle.append(cardText1);
      cardTitle.append(cardText3);
      cardTitle.append(cardText2);
      cardBody.append(cardTitle);
      anchorTag.append(img);
      recipeCard.append(anchorTag);
      recipeCard.append(cardBody);
      this.favoritedRecipesContainer.append(recipeCard);
    }
  }
}
