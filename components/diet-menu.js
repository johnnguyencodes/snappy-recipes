const dietMenu = document.getElementById("diet_menu");
const openDietMenuButton = document.getElementById("open_diet_menu_button");
const closeDietMenuButton = document.getElementById("close_diet_menu_button");

class DietMenu {
  constructor(dietMenu) {
    this.dietMenu = dietMenu;
    openDietMenuButton.addEventListener("click", this.openDietMenu.bind(this));
    closeDietMenuButton.addEventListener("click", this.closeDietMenu.bind(this));
    overlay.addEventListener("click", this.handleOverlayClick.bind(this));
  }

  clickDietInfo(dietInfo) {
    this.dietInfo = dietInfo;
  }

  handleOverlayClick() {
    console.log("hello");
    if (dietMenu.classList.contains("diet-menu-visible")) {
      this.closeDietMenu();
    }
  }

  openDietMenu() {
    event.preventDefault();
    mainContent.className = "row noscroll";
    dietMenu.className = "diet-menu-visible d-flex flex-column justify-content-center";
    overlay.className = "";
  }

  closeDietMenu() {
    event.preventDefault();
    mainContent.className = "row";
    dietMenu.className = "diet-menu-hidden d-flex flex-column justify-content-center";
    this.dietInfo();
    overlay.className = "d-none";
    window.scrollTo({
      top: 0,
      behavior: "auto"
    })
  }
}
