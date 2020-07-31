class DietForm {
  constructor(dietForm) {
    this.dietForm = dietForm;
    openDietMenuButton.addEventListener("click", this.openDietMenu.bind(this));
    closeDietMenuButton.addEventListener("click", this.closeDietMenu.bind(this));
    document.addEventListener("DOMContentLoaded", this.dietMenu.bind(this));
  }


  openDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-visible d-flex flex-column justify-content-center";
  }

  closeDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-hidden"
  }

  startDietMenu(dietMenu) {
    this.dietMenu = dietMenu
  }

  dietMenu() {
    console.log("dietform");
    const restrictions = ["vegan", "vegetarian", "lacto-vegetarian", "ovo-vegetarian", "pescetarian"]
    const intolerances = ["dairy", "egg", "gluten", "peanut", "seafood", "sesame", "shellfish", "soy", "sulfite", "tree-nut", "wheat"]
  }

}
