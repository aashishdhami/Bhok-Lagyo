import { foodItems } from "./fooditems.js";

// Selecting elements
const appLogo = document.querySelector(".logo");

// Containers (IDs)
const vegItems = document.getElementById("pure-veg");
const chickenItems = document.getElementById("chicken-specials");
const biryaniItems = document.getElementById("biryanis");
const chineseItems = document.getElementById("chinese");
const paneerItems = document.getElementById("paneer-specials");

// food items container
const vegContainer = document.querySelector(".pure-veg__container");
const chickenContainer = document.querySelector(".chicken-specials__container");
const biryanisContainer = document.querySelector(".biryanis__container");
const chineseContainer = document.querySelector(".chinese__container");
const paneerContainer = document.querySelector(".paneer-specials__container");

// containers inside #food-container section
const foodContainer = document.querySelector(".food-container");
const myWishlist = document.querySelector("#my-wishlist");
const ourSpecials = document.querySelector("#our-specials");

const searchedRecipesMainContainer =
  document.getElementById("recipe-container");
const myRecipesContainer = document.querySelector(".my-recipes__container");
const bookmarkedRecipesSection = document.getElementById("bookmarked-recipes");

// Menu Btns
const menuCheckoutBtn = document.querySelector(".my-orders");
const menuBookmarksBtn = document.querySelector(".my-bookmarks");
const menuMyRecipesBtn = document.querySelector(".my-recipes");
const menuLogoutBtn = document.querySelector(".logout");

// misc
const specialSectionBtns = document.querySelectorAll(".special-item");
const wishlistContainer = document.querySelector(".wishlist__table-body");
const logoutYesBtn = document.querySelector(".btn__logout-yes");
const logoutNoBtn = document.querySelector(".btn__logout-no");
const logoutModal = document.querySelector(".logout__modal");

const overlay = document.querySelector(".overlay");
const orderSuccessModal = document.querySelector(".order-success__modal");
const checkoutBtn = document.querySelector(".wishlist__checkout-btn");
const checkoutBtnOkay = document.querySelector(".btn__order-success-okay");

const checkoutTotalAmount = document.querySelector(".total-amount");
// -------------------------------------------------------------
// Display current user's name

let currentAccount = JSON.parse(sessionStorage.getItem("currentUser"));
// console.log(currentAccount);

const displayUsersName = function () {
  document.querySelector(
    ".currentUserName "
  ).textContent = `${currentAccount.usersFname}`;
};

displayUsersName();
document.querySelector(".welcome-msg").style.opacity = 1;

// -------------------------------------------------------------
// Displaying all the items

let itemsHTML;
// itemsDataArray -> an array containing objects (food items) of a specific category
const createItemCards = function (itemsDataArray, itemsContainer) {
  itemsHTML = "";

  itemsDataArray.forEach(function (foodItem, index) {
    itemsHTML += `<div class="item-card">
    <div class="item-card__top">
      <i class="fa fa-star rating">&nbsp;${itemsDataArray[index].rating}</i>
      <i class="fa-regular fa-heart add-to-cart"></i>
    </div>
    <img
      src="${itemsDataArray[index].img}"
      alt="${itemsDataArray[index].name}"
    />
    <p class="item-name">${itemsDataArray[index].name}</p>
    <p class="item-price">Price : Rs ${itemsDataArray[index].price}</p>
  </div>`;
  });

  itemsContainer.innerHTML = itemsHTML;
};

const displayItems = function () {
  // filters out veg items from the foodItems []
  const vegItemsData = foodItems.filter(
    (item) => item.category === "vegetable"
  );
  // create veg items cards
  createItemCards(vegItemsData, vegContainer);
  // vegItemsData is the array, vegItems is the container

  // filters out chicken items from the foodItems []
  const chickenItemsData = foodItems.filter(
    (item) => item.category === "chicken"
  );
  // creates chicken items cards
  createItemCards(chickenItemsData, chickenContainer);

  const biryaniItemsData = foodItems.filter(
    (item) => item.category === "biryani"
  );
  createItemCards(biryaniItemsData, biryanisContainer);

  const chineseItemsData = foodItems.filter(
    (item) => item.category === "chinese"
  );
  createItemCards(chineseItemsData, chineseContainer);

  const paneerItemsData = foodItems.filter(
    (item) => item.category === "paneer"
  );
  createItemCards(paneerItemsData, paneerContainer);
};

displayItems();

// -------------------------------------------------------------
// Adding items to wishlist (My Orders)

// contains wishlisted food items
let wishlist = [];
let wishlistIndex = 0;

let increaseFoodItem, decreaseFoodItem;
let wishlistHTML;

const renderWishlist = function () {
  wishlistHTML = "";
  wishlist.forEach((item) => {
    wishlistHTML += `
    <tr>
    <td class="wishlist__item-img-container">
      <img
        src="${item.itemImg}"
        alt=""
        class="wishlist__item-img"
      />
    </td>
    <td class="wishlist__item-name">${item.itemName}</td>
    <td class="wishlist__item-quantity">
      <button class="decrease-item">-</button><span class="item-qty__text">${item.itemQuantity}</span><button
        class="increase-item"
      >
        +
      </button>
    </td>
    <td class="wishlist__item-price">${item.itemTotalAmount}</td>
  </tr>`;
  });

  wishlistContainer.innerHTML = wishlistHTML;
};

// Now that the item cards have been created, we can select them
const addToCartBtns = document.querySelectorAll(".add-to-cart");

let flag = 0,
  totalAmount = 0;

addToCartBtns.forEach((btn) =>
  btn.addEventListener("click", function () {
    btn.classList.add("highlight__wishlist-btn");
    // this gives the clicked item-name
    const itemName =
      this.parentElement.parentElement.querySelector(".item-name").innerText;

    let itemQuantity = 1;
    let itemPrice;
    let itemImg;
    let itemTotalAmount;

    foodItems.find((item) => {
      if (item.name === itemName) {
        itemImg = item.img;
        itemPrice = item.price;
        itemTotalAmount = item.price;
      }
    });

    if (flag === 0) {
      wishlist.push({
        itemName,
        itemImg,
        itemPrice,
        itemQuantity,
        itemTotalAmount,
      });

      flag = 1;
      totalAmount += itemPrice;
    }

    // makes sure that the same food item isn't wishlisted more than one time
    if (wishlist.some((item) => item.itemName === itemName)) {
      console.log(`item already exists`);
    } else {
      wishlist.push({
        itemName,
        itemImg,
        itemPrice,
        itemQuantity,
        itemTotalAmount,
      });

      wishlistIndex++;
      totalAmount += itemPrice;
    }

    totalAmount = 0;

    wishlist.forEach(function (item) {
      totalAmount += item.itemTotalAmount;
    });

    // checkoutTotalAmount.textContent = totalAmount;
    checkoutTotalAmount.textContent = totalAmount;
  })
);

// total checkout amount displayed
const findItem = function (tableRow) {
  let imgURL, item;
  imgURL = tableRow.querySelector(".wishlist__item-img").getAttribute("src");

  item = wishlist.find((item) => imgURL === item.itemImg);

  return item;
};

// Now that the list has been rendered, we can finally increase / decrease food item qtys
// after checkout, reset the qty and price of all food items

wishlistContainer.addEventListener("click", function (e) {
  let imgURL, item, totalAmount;

  if (
    e.target.classList.contains("increase-item") ||
    e.target.classList.contains("decrease-item")
  ) {
    if (e.target.classList.contains("increase-item")) {
      item = findItem(e.target.parentElement.parentElement);
      item.itemQuantity++;
      // also increase the qty on the page
      e.target.parentElement.parentElement.querySelector(
        ".item-qty__text"
      ).textContent = item.itemQuantity;

      // price should increase according to the qty
      item.itemTotalAmount = item.itemQuantity * item.itemPrice;

      // also display the price on the page
      e.target.parentElement.parentElement.querySelector(
        ".wishlist__item-price"
      ).textContent = item.itemTotalAmount;

      //
    } else if (e.target.classList.contains("decrease-item")) {
      //
      item = findItem(e.target.parentElement.parentElement);
      if (item.itemQuantity > 1) {
        item.itemQuantity--;
        // also decrease the qty on the page
        e.target.parentElement.parentElement.querySelector(
          ".item-qty__text"
        ).textContent = item.itemQuantity;

        item.itemTotalAmount = item.itemQuantity * item.itemPrice;

        e.target.parentElement.parentElement.querySelector(
          ".wishlist__item-price"
        ).textContent = item.itemTotalAmount;
      }
    }

    totalAmount = 0;

    wishlist.forEach(function (item) {
      totalAmount += item.itemTotalAmount;
    });

    checkoutTotalAmount.textContent = totalAmount;
  }
});

// -------------------------------------------------------------
// App logo

appLogo.addEventListener("click", function () {
  // hide all other sections
  myWishlist.classList.add("hidden");
  bookmarkedRecipesSection.classList.add("hidden");
  myRecipesContainer.classList.add("hidden");
  // ourSpecials.classList.add("hidden");
  searchedRecipesMainContainer.classList.add("hidden");

  // only display this section
  foodContainer.classList.remove("hidden");
});

// -------------------------------------------------------------
// Special section btns

specialSectionBtns.forEach((btn) =>
  btn.addEventListener("click", function () {
    // hide all other sections
    myWishlist.classList.add("hidden");
    bookmarkedRecipesSection.classList.add("hidden");
    myRecipesContainer.classList.add("hidden");
    // ourSpecials.classList.add("hidden");
    searchedRecipesMainContainer.classList.add("hidden");

    // only display this section
    foodContainer.classList.remove("hidden");
  })
);

// -------------------------------------------------------------
// Checkout Btn

menuCheckoutBtn.addEventListener("click", function () {
  // hide all other sections
  foodContainer.classList.add("hidden");
  bookmarkedRecipesSection.classList.add("hidden");
  myRecipesContainer.classList.add("hidden");
  // ourSpecials.classList.add("hidden");
  searchedRecipesMainContainer.classList.add("hidden");

  // only display this section
  myWishlist.classList.remove("hidden");
  // wishlistContainer.classList.remove("hidden");
  wishlistContainer.dispatchEvent(new CustomEvent("refreshWishlist"));
});

// -------------------------------------------------------------
// Bookmarked Recipes Btn

bookmarkedRecipesBtn.addEventListener("click", function () {
  // hide all other sections
  foodContainer.classList.add("hidden");
  myWishlist.classList.add("hidden");
  myRecipesContainer.classList.add("hidden");
  // ourSpecials.classList.add("hidden");
  searchedRecipesMainContainer.classList.add("hidden");

  // only display this section
  bookmarkedRecipesSection.classList.remove("hidden");
});

// -------------------------------------------------------------
// My Recipes Btn

menuMyRecipesBtn.addEventListener("click", function () {
  // hide all other sections
  foodContainer.classList.add("hidden");
  myWishlist.classList.add("hidden");
  // ourSpecials.classList.add("hidden");
  searchedRecipesMainContainer.classList.add("hidden");
  bookmarkedRecipesSection.classList.add("hidden");

  // only display this section
  myRecipesContainer.classList.remove("hidden");
});

// -------------------------------------------------------------
// Logout

menuLogoutBtn.addEventListener("click", function (e) {
  logoutModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

logoutYesBtn.addEventListener("click", function (e) {
  // console.log(e.target);
  logoutModal.classList.add("hidden");
  overlay.classList.add("hidden");
  window.location.href = "../index.html";
  sessionStorage.removeItem("currentUser");
});

logoutNoBtn.addEventListener("click", function (e) {
  logoutModal.classList.add("hidden");
  overlay.classList.add("hidden");
});

// -------------------------------------------------------------
// checkout

checkoutBtn.addEventListener("click", function () {
  orderSuccessModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

checkoutBtnOkay.addEventListener("click", function () {
  orderSuccessModal.classList.add("hidden");
  overlay.classList.add("hidden");
  wishlist = [];
  wishlistContainer.dispatchEvent(new CustomEvent("refreshWishlist"));
  addToCartBtns.forEach((btn) =>
    btn.classList.remove("highlight__wishlist-btn")
  );
  // total amount set to 0
  totalAmount = 0;
  checkoutTotalAmount.textContent = 0;
});

// -------------------------------------------------------------
wishlistContainer.addEventListener("refreshWishlist", renderWishlist);
