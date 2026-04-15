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
