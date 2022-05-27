// Selecting elements

// containers inside #food-container section
const searchedRecipesContainer = document.querySelector(
  ".searched-recipes-wrap"
);
const searchedRecipesMainContainer =
  document.getElementById("recipe-container");
const myRecipesContainer = document.querySelector(".my-recipes__container");
const bookmarkedRecipesSection = document.getElementById("bookmarked-recipes");

const foodContainer = document.querySelector(".food-container");
const myWishlist = document.querySelector("#my-wishlist");
const ourSpecials = document.querySelector("#our-specials");

// contains search bar (input element) & search icon
const searchForm = document.querySelector(".search-form");
// card which contains searched result
// const searchResultCard = document.querySelector(".food-recipe");
const recipeContainer = document.getElementById("recipe-container");

// misc
const bookmarkedRecipesBtn = document.querySelector(".my-bookmarks");
const bookmarkedRecipesContainer = document.querySelector(
  ".bookmarked-recipes__container"
);

const savedRecipesContainer = document.querySelector(
  ".saved-recipes-container"
);
const recipeForm = document.getElementById("create-recipe__form");

// -------------------------------------------------------------
// API (edamam) (for recipe searching)
const appID = "041bab38";
const appKey = "9a5a84bca3b584994d4baeae0cfbd21a";

// Food item that is searched
let searchQuery = "";
// contains searched recipes
let searchedRecipes = [];

let bookmarkRecipeIcons;

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (searchQuery !== "") {
    searchedRecipesContainer.innerHTML = "";
    searchQuery = "";
  }

  searchQuery = e.target.querySelector(".input").value;

  e.target.querySelector(".input").value = "";

  fetchAPI(searchQuery);
});

const fetchAPI = async function (itemName) {
  // q is for query
  const baseURL = `https://api.edamam.com/search?q=${itemName}&app_id=${appID}&app_key=${appKey}&to=20`;

  // status 200 means API is successfully fetched
  const response = await fetch(baseURL);
  const data = await response.json();
  searchedRecipes = data.hits;

  // Only when fetched data arrives (i.e. after await and just before rendering searched data)
  // hide all other sections
  foodContainer.classList.add("hidden");
  bookmarkedRecipesSection.classList.add("hidden");
  myRecipesContainer.classList.add("hidden");
  myWishlist.classList.add("hidden");

  // Display this section
  searchedRecipesMainContainer.classList.remove("hidden");

  searchedRecipesContainer.dispatchEvent(
    new CustomEvent("showSearchedRecipes")
  );

  // generateHTML(data.hits);

  // BOOKMARKS

  const foodRecipeCards = document.querySelectorAll(".food-recipe");

  foodRecipeCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.classList.contains("bookmark-icon")) {
        e.target.classList.toggle("bookmark-recipe");

        const bookmarkedFoodName =
          e.target.parentElement.querySelector(".food-name").textContent;
        const bookmarkedFoodImg = e.target.parentElement
          .querySelector(".food-recipe__img")
          .getAttribute("src");
        const bookmarkedFoodURL = e.target.parentElement
          .querySelector(".check-recipe__btn")
          .getAttribute("href");

        // console.log(bookmarkedFoodName, bookmarkedFoodImg, bookmarkedFoodURL);
        if (
          bookmarkedRecipesList.some(
            (item) => item.bookmarkedFoodName === bookmarkedFoodName
          )
        )
          console.log(`Food already bookmarked`);
        else {
          bookmarkedRecipesList.push({
            bookmarkedFoodImg,
            bookmarkedFoodName,
            bookmarkedFoodURL,
          });

          // Custom event (when this occurs, save the bookmark to localStorage)
          bookmarkedRecipesContainer.dispatchEvent(
            new CustomEvent("renderBookmarks")
          );
        }
      }
    });
  });
};

let searchedRecipeHTML;
const renderSearchedRecipes = function () {
  searchedRecipeHTML = "";
  searchedRecipes.map((result) => {
    searchedRecipeHTML += `
    <div class="food-recipe">
    <i class="fa-solid fa-star bookmark-icon"></i>
    <img
      src="${result.recipe.image}"
      alt="${result.recipe.label}"
      class="food-recipe__img"
    />
    <p class="food-name">${result.recipe.label}</p>

    <a href="${result.recipe.url}" class="check-recipe__btn" target="_blank"
              >Check Recipe</a
            >
  </div>
    `;
  });

  searchedRecipesContainer.innerHTML = searchedRecipeHTML;
};

// -------------------------------------------------------------
// Bookmarking recipe

let bookmarkedRecipesList = [];

bookmarkedRecipesBtn.addEventListener("click", function () {
  if (bookmarkedRecipesSection.classList.contains("hidden")) {
    searchedRecipesContainer.innerHTML = "";
    bookmarkedRecipesSection.classList.remove("hidden");
    foodContainer.classList.add("hidden");

    renderBookmarkedRecipes();
  } else {
    bookmarkedRecipesSection.classList.add("hidden");
    foodContainer.classList.remove("hidden");
  }
});

let bookmarksHTML = "";

const renderBookmarkedRecipes = function () {
  bookmarksHTML = "";
  bookmarkedRecipesList.forEach(function (recipe) {
    bookmarksHTML += `
    <div class="bookmarked__recipe-item">
              <img
                src="${recipe.bookmarkedFoodImg}"
                alt=""
                class="bookmarked__recipe-img"
              />
              <h2 class="bookmarked__recipe-name">${recipe.bookmarkedFoodName}</h2>
              <a href="${recipe.bookmarkedFoodURL}" class="bookmarked__view-recipe-btn" target="_blank">View Recipe</a>
            </div>
    `;
  });

  bookmarkedRecipesContainer.innerHTML = bookmarksHTML;
};

const storeBookmarksLocalStorage = function () {
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarkedRecipesList));
};

const loadBookmarkedRecipes = function () {
  const bookmarkedRecipes = localStorage.getItem("bookmarksList");
  // if the list is empty, then just return
  if (bookmarkedRecipes === [] || bookmarkedRecipes === null) return;

  // assign locally stored recipes to recipeList
  bookmarkedRecipesList.push(...JSON.parse(bookmarkedRecipes));
  bookmarkedRecipesContainer.dispatchEvent(new CustomEvent("renderBookmarks"));
};

// Implementing My Recipes Btn
const myRecipes = document.querySelector(".my-recipes");

myRecipes.addEventListener("click", function () {
  foodContainer.classList.add("hidden");
  myRecipesContainer.classList.remove("hidden");
});

// -------------------------------------------------------------
// Creating a new recipe

let recipeList = [];

const handleFormSubmit = function (e) {
  e.preventDefault();

  //   console.log(e.target);
  const recipeName = e.target.querySelector(".recipe-name").value;
  const recipeMethod = e.target.querySelector(".recipe-method").value;
  const recipeTime = e.target.querySelector(".recipe-time").value;
  const recipeNotes = e.target.querySelector(".recipe-notes").value;

  const newRecipe = {
    recipeName,
    recipeMethod,
    recipeTime,
    recipeNotes,
    recipeID: Date.now(),
  };

  //   console.log(newRecipe);

  if (newRecipe.recipeName && newRecipe.recipeMethod && newRecipe.recipeTime) {
    recipeList.push(newRecipe);
  }

  // Reset the form elements on submit
  e.target.reset();

  // when a new recipe is added to the recipeList, a custom event occurs on recipeContainer called 'refreshRecipes'. When this event occurs, recipes (recipeList) needs to be rendered. We handle this custom event below
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
};

// Actually renders all the user created recipes (array)
const renderRecipes = function () {
  let recipeHTML = "";

  recipeList.map((recipe) => {
    recipeHTML += `<ul class="saved-recipes__card">
        <h2 class="saved-recipe__title">${recipe.recipeName}</h2>
        <li>
          <span class="title">Method:&nbsp;</span
          ><span class="body"
            >${recipe.recipeMethod}</span
          >
        </li>
        <li>
          <span class="title">Time required:&nbsp;</span>
          <span class="body">${recipe.recipeTime} minutes</span>
        </li>
        <li>
        <div>
          <span class="title">Notes:&nbsp;</span>
          <span class="body">${
            recipe.recipeNotes === "" ? "Empty" : recipe.recipeNotes
          }</span>
          </div>
          <button class="delete-recipe__btn" value="${
            recipe.recipeID
          }">Delete Recipe</button>
        </li>
      </ul>`;
    // Giving "value" to the delete recipe btn was a nice logic
  });

  savedRecipesContainer.innerHTML = recipeHTML;
};

// Saving user created recipes to localStorage
const storeToLocalStorage = function () {
  localStorage.setItem("recipeList", JSON.stringify(recipeList));
};

// Rendering saved recipes from localStorage
const loadSavedRecipes = function () {
  const savedRecipes = localStorage.getItem("recipeList");
  // if the list is empty, then just return
  if (savedRecipes === [] || savedRecipes === null) return;

  // assign locally stored recipes to recipeList
  recipeList.push(...JSON.parse(savedRecipes));
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
};

// Deleting a recipe

const deleteRecipeItem = function (deleteBtn) {
  // e.target.value gives the ID of recipe to be deleted
  recipeList = recipeList.filter(
    (recipeItem) => recipeItem.recipeID != Number(deleteBtn.value)
  );

  // the new list needs to be rendered and saved into localStorage as well
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
};

savedRecipesContainer.addEventListener("click", function (e) {
  // selected the delete recipe btn
  if (e.target.classList.contains("delete-recipe__btn")) {
    // console.log(Number(e.target.value));
    deleteRecipeItem(e.target);
  }
});

// -------------------------------------------------------------
// EVENT HANDLERS

// On searching for a recipe
searchedRecipesContainer.addEventListener(
  "showSearchedRecipes",
  renderSearchedRecipes
);

recipeForm.addEventListener("submit", handleFormSubmit);
// refreshRecipes i.e. recipeList needs to be rendered
recipeContainer.addEventListener("refreshRecipes", renderRecipes);
// whenever a new recipe is created, it needs to be added to the recipeList and then stored to localStorage
recipeContainer.addEventListener("refreshRecipes", storeToLocalStorage);
// when window is loaded, render all the saved recipes from localStorage
window.addEventListener("DOMContentLoaded", loadSavedRecipes);

// <------bookmarks related-------->
bookmarkedRecipesContainer.addEventListener(
  "renderBookmarks",
  storeBookmarksLocalStorage
);

bookmarkedRecipesContainer.addEventListener(
  "renderBookmarks",
  renderBookmarkedRecipes
);

// if page reloads
window.addEventListener("DOMContentLoaded", loadBookmarkedRecipes);
