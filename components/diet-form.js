class DietForm {
  constructor(dietForm) {
    this.dietForm = dietForm;
    openDietMenuButton.addEventListener("click", this.openDietMenu.bind(this));
    closeDietMenuButton.addEventListener("click", this.closeDietMenu.bind(this));
  }

  clickDietInfo(dietInfo) {
    this.dietInfo = dietInfo;
  }

  openDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-visible d-flex flex-column justify-content-center";
  }

  closeDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-hidden d-flex flex-column justify-content-center";
    this.dietInfo();
  }
}
