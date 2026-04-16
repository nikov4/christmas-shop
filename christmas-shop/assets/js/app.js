const body = document.getElementsByTagName("html")[0];

// Timer

let timerDays = 0;
let timerHours = 0;
let timerMinutes = 0;
let timerSeconds = 0;
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Timer() {
  // get current
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  const currentHour = date.getUTCHours();
  const currentMinute = date.getMinutes();
  const currentSeconds = date.getSeconds();

  //check for leap
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
        giftsContent = giftsContent.concat(";", superpowerKey, ":", superpowerValue);
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
  modalSp = "",
  modalSpName = "",
  modalSpValue = "",
  modalSpSnowflakes = "";

function modalShow(modalId) {
  for (const [key] of gifts) {
    if (key === modalId) {
      modalWrapper.style.display = "block";
      modalWindow.style.display = "block";
      body.classList.toggle("no-scroll");

      modalWrapper.addEventListener("click", function (event) {
        modalWrapper.style.display = "none";
        modalWindow.style.display = "none";
        modalWindow.replaceChildren();
        body.classList.remove("no-scroll");
      });

      modalWindow.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      let giftsContent = gifts.get(modalId).split(";");
      //console.log("giftsContent=", giftsContent);

      // modal close button
      let modalButtonBox = modalWindow.appendChild(document.createElement("div"));
      modalButtonBox.classList.add("modal-button-container");
      modalButtonBox = modalButtonBox.appendChild(document.createElement("div"));
      modalButtonBox.classList.add("modal-button");
      let modalButtonLine = modalButtonBox.appendChild(document.createElement("span"));
      modalButtonLine.classList.add("modal-line", "modal-line-top");
      modalButtonLine = modalButtonBox.appendChild(document.createElement("span"));
      modalButtonLine.classList.add("modal-line", "modal-line-bottom");
      /*
      modalButton.addEventListener("click", function (event) {
        modalWrapper.style.display = "none";
        modalWindow.style.display = "none";
        modalWindow.replaceChildren();
        body.classList.remove("no-scroll");
      });
      */
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
      modalDescription.classList.add("modal-text");
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

      // SP Names container
      modalSpName = modalSp.appendChild(document.createElement("div"));
      modalSpName.classList.add("modal-sp-name");

      let modalSpName1 = modalSpName.appendChild(document.createElement("div"));
      modalSpName1.classList.add("modal-text");
      modalSpName1 = modalSpName1.appendChild(document.createTextNode("Live"));

      let modalSpName2 = modalSpName.appendChild(document.createElement("div"));
      modalSpName2.classList.add("modal-text");
      modalSpName2 = modalSpName2.appendChild(document.createTextNode("Create"));

      let modalSpName3 = modalSpName.appendChild(document.createElement("div"));
      modalSpName3.classList.add("modal-text");
      modalSpName3 = modalSpName3.appendChild(document.createTextNode("Love"));

      let modalSpName4 = modalSpName.appendChild(document.createElement("div"));
      modalSpName4.classList.add("modal-text");
      modalSpName4 = modalSpName4.appendChild(document.createTextNode("Dream"));

      // SP Values
      modalSpValue = modalSp.appendChild(document.createElement("div"));
      modalSpValue.classList.add("modal-sp-value");

      let modalSpValue1 = modalSpValue.appendChild(document.createElement("div"));
      modalSpValue1.classList.add("modal-text");
      modalSpValue1 = modalSpValue1.appendChild(document.createTextNode("+000"));

      let modalSpValue2 = modalSpValue.appendChild(document.createElement("div"));
      modalSpValue2.classList.add("modal-text");
      modalSpValue2 = modalSpValue2.appendChild(document.createTextNode("+000"));

      let modalSpValue3 = modalSpValue.appendChild(document.createElement("div"));
      modalSpValue3.classList.add("modal-text");
      modalSpValue3 = modalSpValue3.appendChild(document.createTextNode("+000"));

      let modalSpValue4 = modalSpValue.appendChild(document.createElement("div"));
      modalSpValue4.classList.add("modal-text");
      modalSpValue4 = modalSpValue4.appendChild(document.createTextNode("+000"));

      // SP Snowflakes container
      modalSpSnowflakes = modalSp.appendChild(document.createElement("div"));
      modalSpSnowflakes.classList.add("modal-sp-snowflakes");

      let modalSpSnowflakes1 = modalSpSnowflakes.appendChild(document.createElement("div"));
      modalSpSnowflakes1.classList.add("modal-text");
      modalSpSnowflakes1 = modalSpSnowflakes1.appendChild(document.createTextNode("*****"));

      let modalSpSnowflakes2 = modalSpSnowflakes.appendChild(document.createElement("div"));
      modalSpSnowflakes2.classList.add("modal-text");
      modalSpSnowflakes2 = modalSpSnowflakes2.appendChild(document.createTextNode("*****"));

      let modalSpSnowflakes3 = modalSpSnowflakes.appendChild(document.createElement("div"));
      modalSpSnowflakes3.classList.add("modal-text");
      modalSpSnowflakes3 = modalSpSnowflakes3.appendChild(document.createTextNode("*****"));

      let modalSpSnowflakes4 = modalSpSnowflakes.appendChild(document.createElement("div"));
      modalSpSnowflakes4.classList.add("modal-text");
      modalSpSnowflakes4 = modalSpSnowflakes4.appendChild(document.createTextNode("*****"));
    }
  }
}

// Detect current page
const path = window.location.pathname;
if (path === "/gifts.html") {
  // interactions with tabs
  for (let tab of tabs) {
    tab.addEventListener("click", function (event) {
      tab.classList.add("tab__active");
      const tabSelected = event.target.getAttribute("data-value");
      getItems(tabSelected);
    });
  }
  // Get items
  getItems("All");
} else {
  // Run timer
  const timerId = setInterval(Timer, 1000);
  // Get items
  getItems();
}
