const body = document.getElementsByTagName("html")[0];

// Timer
function Timer() {
  let timerDays = 0;
  let timerHours = 0;
  let timerMinutes = 0;
  let timerSeconds = 0;
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // get current
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  const currentHour = date.getUTCHours();
  const currentMinute = date.getMinutes();
  const currentSeconds = date.getSeconds();

  // check for leap
  const leapYearDate = new Date(currentYear, 1, 29);
  let leapYear = leapYearDate.getMonth();
  if (leapYear === 1) {
    daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  // calc timer
  timerDays = daysInMonth[currentMonth] - currentDay;
  for (let i = currentMonth + 1; i <= 11; i += 1) {
    timerDays = timerDays + daysInMonth[i];
  }
  timerHours = 23 - currentHour;
  timerMinutes = 59 - currentMinute;
  timerSeconds = 59 - currentSeconds;

  // set values
  document.querySelector(".timer-items-container .timer-item .timer-days").textContent = timerDays;
  document.querySelector(".timer-items-container .timer-item .timer-hours").textContent = timerHours;
  document.querySelector(".timer-items-container .timer-item .timer-minutes").textContent = timerMinutes;
  document.querySelector(".timer-items-container .timer-item .timer-seconds").textContent = timerSeconds;
}

// GetItems
const jsonFile = "./assets/json/gifts.json";
const itemsContainer = document.querySelector(".best-items-container");
const tabs = document.querySelectorAll(".gifts-tab");
const tags = new Map([
  ["For Work", "tag-purple"],
  ["For Health", "tag-green"],
  ["For Harmony", "tag-pink"],
]);
let gifts = new Map();
const empty = "";
let item = "",
  itemId = "",
  itemImg = "",
  img = "",
  itemCaption = "",
  itemName = "",
  itemTag = "";

// get data from json
async function getItems(category) {
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();

    // create data array
    for (let [key, value] of Object.entries(data)) {
      let categoryImg = value.category;
      categoryImg = categoryImg.toLowerCase();
      categoryImg = categoryImg.replaceAll(" ", "-");
      categoryImg = `./assets/images/gift-${categoryImg}.png`;
      let giftsContent = empty.concat(value.category, ";", value.name, ";", categoryImg, ";", value.description);
      // add superpowers
      const superpowersParams = value.superpowers;
      for (let [superpowerKey, superpowerValue] of Object.entries(superpowersParams)) {
        giftsContent = giftsContent.concat(";", superpowerValue);
      }
      gifts.set(key, giftsContent);
    }

    // clear items
    itemsContainer.replaceChildren();
    for (let tab of tabs) {
      if (tab.dataset.value === category) {
        tab.classList.add("tab__active");
      } else {
        tab.classList.remove("tab__active");
      }
    }

    if (category) {
      // loop for category
      for (const [key] of gifts) {
        let giftsContent = gifts.get(key).split(";");
        if (category === "All" || category === giftsContent[0]) {
          // add item
          addItem(key);
        }
      }
    } else {
      // loop for random
      let randomGift = 0;
      let randomList = "";
      let randomStr = "';";
      let j = 1;
      for (let i = 1; j <= 4; i += 1) {
        randomGift = Math.floor(Math.random() * gifts.size);
        // check for duplicating number
        randomStr = empty.concat("-", randomGift, "-");
        if (!randomList.includes(randomStr)) {
          // create random item
          for (const [key] of gifts) {
            if (Number(key) === randomGift) {
              // add item
              addItem(key);
              randomList = randomList.concat("-", randomGift, "-", ",");
              j++;
            }
          }
        }
      }
    }

    // Add item
    function addItem(id) {
      let giftsContent = gifts.get(id).split(";");

      // item container
      item = itemsContainer.appendChild(document.createElement("div"));
      item.classList.add("best-item");
      item.setAttribute("data-id", id);
      item.addEventListener("click", () => {
        modalShow(id);
      });

      // item image
      itemImg = item.appendChild(document.createElement("div"));
      itemImg.classList.add("best-item-image");
      img = itemImg.appendChild(document.createElement("img"));
      img.setAttribute("src", giftsContent[2]);
      img.setAttribute("alt", giftsContent[1]);
      img.classList.add("best-image");

      // item caption
      itemCaption = item.appendChild(document.createElement("div"));
      itemCaption.classList.add("best-item-caption");

      // item caption tag
      itemTag = itemCaption.appendChild(document.createElement("div"));
      itemTag.classList.add("best-header-h4", `${tags.get(giftsContent[0])}`);
      itemTag = itemTag.appendChild(document.createTextNode(giftsContent[0]));

      // item caption name
      itemName = itemCaption.appendChild(document.createElement("div"));
      itemName.classList.add("best-header-h3");
      itemName = itemName.appendChild(document.createTextNode(giftsContent[1]));
    }
  } catch (error) {
    console.log(error.name + ": " + error.message);
  }
}

// Show modal window
function modalShow(giftId) {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const modalWindow = document.querySelector(".modal-window");
  const modalButton = document.querySelector(".modal-button");
  let modal = "",
    modalImg = "",
    modalCaption = "",
    modalTag = "",
    modalName = "",
    modalDescription = "",
    modalSuperpowers = "",
    modalSp = "";

  for (const [key] of gifts) {
    if (key === giftId) {
      modalWrapper.style.display = "block";
      modalWindow.style.display = "block";
      body.classList.toggle("no-scroll");
      modalWindow.classList.toggle("modal__active");

      modalWrapper.addEventListener("click", function (event) {
        modalWrapper.style.display = "none";
        modalWindow.style.display = "none";
        modalWindow.replaceChildren();
        body.classList.remove("no-scroll");
        modalWindow.classList.remove("modal__active");
      });

      modalWindow.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      let giftsContent = gifts.get(giftId).split(";");

      // modal close button
      let modalButtonBox = modalWindow.appendChild(document.createElement("div"));
      modalButtonBox.classList.add("modal-button-container");
      modalButtonBox = modalButtonBox.appendChild(document.createElement("div"));
      modalButtonBox.classList.add("modal-button");
      let modalButtonLine = modalButtonBox.appendChild(document.createElement("span"));
      modalButtonLine.classList.add("modal-line", "modal-line-top");
      modalButtonLine = modalButtonBox.appendChild(document.createElement("span"));
      modalButtonLine.classList.add("modal-line", "modal-line-bottom");

      modalButtonBox.addEventListener("click", function (event) {
        modalWrapper.style.display = "none";
        modalWindow.style.display = "none";
        modalWindow.replaceChildren();
        body.classList.remove("no-scroll");
        modalWindow.classList.remove("modal__active");
      });

      // modal container
      modal = modalWindow.appendChild(document.createElement("div"));
      modal.classList.add("modal-container");

      // modal image
      modalImg = modal.appendChild(document.createElement("div"));
      modalImg.classList.add("modal-image");
      const img = modalImg.appendChild(document.createElement("img"));
      img.setAttribute("src", giftsContent[2]);
      img.setAttribute("alt", giftsContent[1]);
      //img.classList.add("modal-image");

      // modal caption
      modalCaption = modal.appendChild(document.createElement("div"));
      modalCaption.classList.add("modal-caption");

      // modal caption tag
      modalTag = modalCaption.appendChild(document.createElement("div"));
      modalTag.classList.add("best-header-h4", `${tags.get(giftsContent[0])}`);
      modalTag = modalTag.appendChild(document.createTextNode(giftsContent[0]));

      // modal caption name
      modalName = modalCaption.appendChild(document.createElement("div"));
      modalName.classList.add("best-header-h3");
      modalName = modalName.appendChild(document.createTextNode(giftsContent[1]));

      // modal caption description
      modalDescription = modalCaption.appendChild(document.createElement("div"));
      modalDescription.classList.add("modal-description");
      modalDescription = modalDescription.appendChild(document.createTextNode(giftsContent[3]));

      // modal superpowers
      modalSuperpowers = modal.appendChild(document.createElement("div"));
      modalSuperpowers.classList.add("modal-superpowers");
      modalSuperpowers = modalSuperpowers.appendChild(document.createElement("div"));
      modalSuperpowers.classList.add("best-header-h4");
      modalSuperpowers = modalSuperpowers.appendChild(document.createTextNode("Adds superpowers to:"));

      // modal superpowers container
      modalSp = modal.appendChild(document.createElement("div"));
      modalSp.classList.add("modal-sp-container");

      // SP content
      const modalRows = ["name", "value", "snowflakes"];
      const modalCols = ["Live", "Create", "Love", "Dream"];
      for (let i = 0; i <= 2; i += 1) {
        let modalRowClass = `modal-sp-${modalRows[i]}`;
        let modalSpRow = modalSp.appendChild(document.createElement("div"));
        modalSpRow.classList.add(modalRowClass);
        for (let j = 0; j <= 3; j += 1) {
          let modalSpCol = modalSpRow.appendChild(document.createElement("div"));
          // names
          if (i === 0) {
            modalSpCol.classList.add("modal-text");
            modalSpCol = modalSpCol.appendChild(document.createTextNode(modalCols[j]));
          }
          // values
          else if (i === 1) {
            modalSpCol.classList.add("modal-text");
            modalSpCol = modalSpCol.appendChild(document.createTextNode(`${giftsContent[j + 4]}`));
          }
          // snowflakes
          else {
            let snowflakesNumber = `${giftsContent[j + 4]}` / 100;
            modalSpCol.classList.add("modal-snowflakes");
            for (let k = 0; k <= 4; k += 1) {
              let snowflake = modalSpCol.appendChild(document.createElement("div"));
              if (k < snowflakesNumber) {
                snowflake.classList.add("modal-snowflake");
              } else {
                snowflake.classList.add("modal-snowflake-white");
              }
            }
          }
        }
      }
    }
  }
}

// Slider
function slider() {
  const screenWidth = window.innerWidth;
  let containerWidth = document.querySelector(".container").scrollWidth;
  const sliderContainer = document.querySelector(".slider-items-container");
  const sliderWidth = sliderContainer.scrollWidth;
  const slides = document.querySelectorAll(".slider-item");
  const sliderPrev = document.querySelectorAll(".slider-button")[0];
  const sliderNext = document.querySelectorAll(".slider-button")[1];
  let sliderMargin = 80;
  let shiftTotal = 0;
  let shiftCount = 0;
  if (screenWidth > 768) {
    shiftTotal = 3;
  } else {
    containerWidth = window.innerWidth;
    sliderMargin = 16;
    shiftTotal = 6;
  }

  // previous slide
  sliderPrev.addEventListener("click", function () {
    if (shiftCount > 0) {
      shiftCount--;
      sliderMove();
    }
  });

  // next slide
  sliderNext.addEventListener("click", function () {
    if (shiftCount < shiftTotal) {
      shiftCount++;
      sliderMove();
    }
  });

  // slider move
  function sliderMove() {
    // 1st slide
    if (shiftCount === 0) {
      sliderPrev.classList.add("slider-button__inactive");
    }
    // last slide
    else if (shiftCount === shiftTotal) {
      sliderNext.classList.add("slider-button__inactive");
    }
    // intermediate slides
    else {
      sliderPrev.classList.remove("slider-button__inactive");
      sliderNext.classList.remove("slider-button__inactive");
    }
    const shiftSize = ((sliderWidth - containerWidth + sliderMargin * 2) / shiftTotal) * shiftCount;
    // console.log("containerWidth=", containerWidth, "sliderWidth=", sliderWidth, "shiftTotal=", shiftTotal);
    // console.log("shiftSize=", shiftSize, "shiftCount=", shiftCount);
    sliderContainer.style.transform = "translateX(-" + shiftSize + "px)";
  }

  // reset slider when resize window
  window.addEventListener("resize", function () {
    shiftCount = 0;
    sliderPrev.classList.add("slider-button__inactive");
    sliderNext.classList.remove("slider-button__inactive");
    sliderContainer.style.transform = "translateX(0px)";
  });
}

// Scroll to top
function scrollTop() {
  const scrollButton = document.querySelector(".scroll-to-top");
  window.addEventListener("scroll", function () {
    let scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled >= 300 && window.innerWidth <= 768) {
      scrollButton.style.display = "flex";
      scrollButton.addEventListener("click", (event) => {
        window.scrollY = 0;
        scrollButton.style.display = "none";
        window.scrollTo(pageYOffset, 0);
      });
    } else {
      scrollButton.style.display = "none";
    }

    // hide scroll button when resize window
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        scrollButton.style.display = "none";
      }
    });
  });
}

// detect current page
const locationPath = window.location.pathname;
if (locationPath === "/gifts.html" || locationPath === "/nikov4-JSFEPRESCHOOL2026Q1/christmas-shop/gifts.html") {
  // scroll to top
  scrollTop();
  // interactions with tabs
  for (let tab of tabs) {
    tab.addEventListener("click", function (event) {
      tab.classList.add("tab__active");
      const tabSelected = event.target.getAttribute("data-value");
      // get items by category
      getItems(tabSelected);
    });
  }
  // get all items
  getItems("All");
} else {
  // activate slider
  slider();
  // run timer
  const timerId = setInterval(Timer, 1000);
  // get random items
  getItems();
}
