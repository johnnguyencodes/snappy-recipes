//*Form Begin

openDietMenu() {
  event.preventDefault();
  document.getElementById("diet_menu").className = "diet-menu-visible d-flex flex-column justify-content-center";
}

closeDietMenu() {
  event.preventDefault();
  document.getElementById("diet_menu").className = "diet-menu-hidden"
}

dietInfo() {
  let restrictionValues = "";
  let intoleranceValues = "";
  var restrictionCheckboxes = document.getElementsByClassName("restrictionCheckbox");
  for (var i = 0; i < restrictionCheckboxes.length; i++) {
    if (restrictionCheckboxes[i].checked) {
      restrictionValues += restrictionCheckboxes[i].value + ", ";
    }
  }
  var intoleranceCheckboxes = document.getElementsByClassName("intoleranceCheckbox");
  for (var j = 0; j < intoleranceCheckboxes.length; j++) {
    if (intoleranceCheckboxes[j].checked) {
      intoleranceValues += intoleranceCheckboxes[j].value + ", ";
    }
  }
  spoonacularDataToSend.diet = restrictionValues.slice(0, -2)
  spoonacularDataToSend.intolerances = intoleranceValues.slice(0, -2);
}

//*Form End
