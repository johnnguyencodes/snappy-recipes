# Snappy Recipes
> * Maintained by: `John Nguyen`

A web application that helps users find and save recipes by identifying an image of a food item using machine learning.

## Feature Overview
### The user can interact with the app in two ways
  1. Uploading an image will send requests to the following APIs using jQuery AJAX to find recipes:
      * POST request to Imgur's API to upload and generate the image's URL (https://apidocs.imgur.com/).
      * POST request to Google's Cloud Vision API to utilize machine learning to label the dominant object within the image at the generated URL (https://cloud.google.com/vision/docs).
      * GET request to Spoonacular's API with the label as a search query which will respond with a list of related recipes (https://spoonacular.com/food-api).  This list is then dynamically created on the DOM.
  2. Entering a search query will send a GET request to Spoonacular's API which will respond with a list of related recipes.
### Other features
* The user can specify diet preferences to modify the search query. These preferences are stored locally and will persist after the browser window is closed.

* The user can add to and remove from the favorite recipes list. This list is also stored locally.

* The user can view a preview of the recipe, and can navigate to its webpage in a new browser tab.

* The app is mobile responsive and can be used on the following devices in portrait and landscape mode:
  * iPhone 6/7/8
  * iPhone 6/7/8 Plus
  * iPhone X
  * iPad
  * iPad Pro

### Issues
* Using the app on an iPhone causes the form's layout to temporarily break when an image is being processed.

## Lessons Learned
1. Chaining multiple API calls using jQuery AJAX to send, manipulate, and display data using vanilla JavaScript.
2. Creating a basic yet responsive user interface with Bootstrap 4 and Window.localStorage.
3. Leveraging Object Oriented Programming to organize code into individual modules for code reusability and maintenance.
5. Experienced the full development process of a static website: Planning, Development, Implementation, Deployment, Publishing.

## Live Site
* The live version of the app can be viewed [here](https://snappy-recipes.johnnguyencodes.com).

### Demos

* Desktop
<img src="https://user-images.githubusercontent.com/61361957/92297145-06647f80-eef1-11ea-9fd8-0f5733dcf8a0.gif" width="600" alt="Desktop Demo Gif"/>

* iPhone 6/7/8 - Portrait
<img src="https://user-images.githubusercontent.com/61361957/92297158-2c8a1f80-eef1-11ea-8b68-49b6d1e2c515.gif" width="600" alt="iPhone 6/7/8 - Portrait - Demo Gif"/>


* iPhone 6/7/8 - Landscape
<img src="https://user-images.githubusercontent.com/61361957/92297147-095f7000-eef1-11ea-9179-fe6ae5f86991.gif" width="600" alt="iPhone 6/7/8 - Landscape - Demo Gif"/>

* iPad - Portrait
<img src="https://user-images.githubusercontent.com/61361957/92297148-0bc1ca00-eef1-11ea-9795-cce70c226739.gif" width="600" alt="iPad - Portrait - Demo Gif"/>

* iPad - Landscape
<img src="https://user-images.githubusercontent.com/61361957/92297149-0c5a6080-eef1-11ea-9a1e-aa3499ddd722.gif" width="600" alt="iPad - Landscape - Demo Gif"/>
