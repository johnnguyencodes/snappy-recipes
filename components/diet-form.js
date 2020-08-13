class DietForm {
  constructor(dietForm) {
    this.dietForm = dietForm;
    openDietMenuButton.addEventListener("click", this.openDietMenu.bind(this));
    closeDietMenuButton.addEventListener("click", this.closeDietMenu.bind(this));
    document.getElementById("overlay").addEventListener("click", this.handleOverlayClick.bind(this));
  }

  clickDietInfo(dietInfo) {
    this.dietInfo = dietInfo;
  }

  clickOverlay(closeDietMenu) {
    console.log('hello there');
    this.closeDietMenu = closeDietMenu;
  }

  handleOverlayClick() {
    if (document.getElementById("diet_menu").className === "diet-menu-visible d-flex flex-column justify-content-center") {
      this.closeDietMenu();
    }
  }

  openDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-visible d-flex flex-column justify-content-center";
    document.getElementById("overlay").className = "";
  }

  closeDietMenu() {
    event.preventDefault();
    dietMenu.className = "diet-menu-hidden d-flex flex-column justify-content-center";
    this.dietInfo();
    document.getElementById("overlay").className = "d-none";
  }
}
