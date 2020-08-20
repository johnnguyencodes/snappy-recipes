# Snappy Recipes
> * Maintained by: `John Nguyen`

## Feature Overview
### The user can interact with the app in two ways
  1. Uploading an image will send requests to the following APIs using jQuery AJAX to find recipes:
      * POST request to Imgur's API to upload and generate the image's URL (https://apidocs.imgur.com/).
      * POST request to Google's Cloud Vision API to utilize machine learning to label the dominant object within the image at the generated URL (https://cloud.google.com/vision/docs).
      * GET request to Spoonacular's API with the label as a search query which will respond with a list of related recipes (https://spoonacular.com/food-api).  This list is then dynamically created on the DOM.
  2. Entering a search query will only send a GET request to Spoonacular's API which will respond with a list of related recipes.
### Other features
* The user can specify diet preferences to modify the search query. These preferences are stored locally and will persist after the browser window is closed.

* The user can add to and remove from the favorite recipes list. This list is also stored locally.

* The user can view a preview of the recipe.

* The app is mobile responsive and can be used on the following devices:
  * iPhone 6/7/8: Portrait and Landscape
  * iPhone 6/7/8 Plus: Portrait and Landscape
  * iPhone X: Portrait only
  * iPad: Portrait and Landscape
  * iPad Pro: Portrait and Landscape

### Planned Features
* The user can use the app on the iPhone X in Landscape Mode.

## Lessons Learned
1. Chaining multiple API calls using jQuery AJAX to send, manipulate, and display data using vanilla JavaScript.
2. Creating a basic yet responsive user interface with Bootstrap and Window.localStorage.
3. Leveraging Object Oriented Programming to organize code into individual modules for code reusability and maintenance.
5. Experienced the full development process of a static website: Planning, Development, Implementation, Deployment, Publishing.

## Live Site
* The live version of the app can be viewed [here](https://snappy-recipes.johnnguyencodes.com).

### Demos

* Gifs of the app in action will be displayed here.
