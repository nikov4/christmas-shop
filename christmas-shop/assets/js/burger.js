// Burger menu

let burger = document.querySelector(".burger-button");
let burgerContainer = document.querySelector(".burger-container");
//let body = document.getElementsByTagName("body");

// interactions with button
burger.addEventListener("click", function () {
  burger.classList.toggle("burger__active");
  burgerContainer.classList.toggle("burger-container__open");
  body.classList.toggle("no-scroll");
});

// interactions with menu
burgerContainer.addEventListener("click", function () {
  burger.classList.remove("burger__active");
  burgerContainer.classList.remove("burger-container__open");
  body.classList.remove("no-scroll");
});
