"using strict";

// Selecting all the necessary HTML elements first

const signupBtn = document.querySelector(".nav-btns__signup");
const signinBtn = document.querySelector(".nav-btns__signin");
const signupModal = document.querySelector(".signup-modal");
const signinModal = document.querySelector(".signin-modal");
const overlay = document.querySelector(".overlay");
const modalCloseBtns = document.querySelectorAll(".btn--close-modal");

const modalSignupBtn = document.querySelector(".btn-signup");
const modalSigninBtn = document.querySelector(".btn-signin-okay");

const signupSuccessModal = document.querySelector(".signup-success__modal");
const modalUsername = document.querySelector(".signup-username");
const btnSignupOkay = document.querySelector(".btn-signup-okay");

// User sign up detail values (input)
const userFname = document.querySelector(".user-fname"); // Fname means full name
const userPassword = document.querySelector(".user-pw");
const userEmail = document.querySelector(".user-email");

// User sign in detail values (input)
const signinUsername = document.querySelector(".signin-username");
const signinPw = document.querySelector(".signin-pw");

// misc
// error msg during sign-in
const signinErrorMsg = document.querySelector(".wrong-signin-details");

// -------------------------------------------------------------
// Modal Window opening and closing functionalities

const openSignupModal = function (e) {
  e.preventDefault();
  signupModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openSigninModal = function (e) {
  e.preventDefault();
  signinModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  // Closes all the modals no matter if some of them are open or not
  signupModal.classList.add("hidden");
  signinModal.classList.add("hidden");
  signupSuccessModal.classList.add("hidden");
  overlay.classList.add("hidden");

  // also remove the sign-in error msg
  signinErrorMsg.classList.add("hidden");
};

signupBtn.addEventListener("click", openSignupModal);
signinBtn.addEventListener("click", openSigninModal);
modalCloseBtns.forEach((ele) => ele.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);

btnSignupOkay.addEventListener("click", closeModal);

// -------------------------------------------------------------
// Accounts

// An array to store all the accounts (username & pw)
let accounts = [];
let savedAccounts = [];
let currentAccount;

// saved accounts in localStorage
// if there are some elements in the array (i.e. if some accounts are already there in the localStorage), then assign them to accounts[]
const accountDetails = localStorage.getItem("userAccounts");
if (accountDetails) {
  savedAccounts = [...JSON.parse(accountDetails)];
  accounts = savedAccounts;
  //
} else {
  console.log(`accounts don't exist`);
}

// On clicking sign up btn on the Sign Up modal
modalSignupBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const userFullname = userFname.value;
  const userFirstName = userFullname.split(" ")[0];
  // console.log(userFirstName);
  let userName = "";

  userFullname.split(" ").forEach((word) => {
    userName += word[0].toLowerCase();
  });

  const userPw = userPassword.value;

  accounts.push({ userFirstName, userName, userPw });

  signupModal.dispatchEvent(new CustomEvent("storeLocally"));

  closeModal();
  // After closing the modal, clear all the input fields
  userFname.value = userEmail.value = userPassword.value = "";

  modalUsername.textContent = userName;
  signupSuccessModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// On pressing sign in btn on the sign in modal
modalSigninBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const username = signinUsername.value;
  const password = signinPw.value;

  const accountDetails = localStorage.getItem("userAccounts");
  accounts = [...JSON.parse(accountDetails)];

  // sign-in verification
  currentAccount = accounts.find(
    (acc) => acc.userName === username && acc.userPw === password
  );

  // if (currentAccount?.userPw === password)
  if (currentAccount) {
    // clear input field values
    signinUsername.value = signinPw.value = "";

    // Load the hompage
    window.location.href = "/html/main.html";

    // session storage (for currently signed-in account)
    let usersFname = currentAccount.userFirstName;
    let usersPw = currentAccount.userPw;
    let usersUsername = currentAccount.userName;

    sessionStorage.setItem(
      "currentUser",
      JSON.stringify({ usersFname, usersUsername, usersPw })
    );
    //
  } else {
    // clear input field values
    signinUsername.value = signinPw.value = "";

    // display the error msg
    signinErrorMsg.classList.remove("hidden");
    signinErrorMsg.classList.add("animate__error-msg");

    // ⚠️ Very important logic
    // Removes animation after 200ms so that when the btn is clicked once again, the error msg is animated once again
    setTimeout(() => {
      signinErrorMsg.classList.remove("animate__error-msg");
    }, "200");
  }
});

// -------------------------------------------------------------
// localStorage

// Store user accounts details to localStorage
const storeAccountsLocally = function () {
  localStorage.setItem("userAccounts", JSON.stringify(accounts));
};

signupModal.addEventListener("storeLocally", storeAccountsLocally);
