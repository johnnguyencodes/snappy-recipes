const form = new Form();

const imageTitleHandler = new ImageTitleHandler();

const recipesHandler = new RecipesHandler();

const app = new App(form, imageTitleHandler, recipesHandler);
app.start();
