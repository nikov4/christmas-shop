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
  document.querySelector(
    ".timer-items-container .timer-item .timer-days",
  ).textContent = timerDays;
  document.querySelector(
    ".timer-items-container .timer-item .timer-hours",
  ).textContent = timerHours;
  document.querySelector(
    ".timer-items-container .timer-item .timer-minutes",
  ).textContent = timerMinutes;
  document.querySelector(
    ".timer-items-container .timer-item .timer-seconds",
  ).textContent = timerSeconds;
}

// Run timer
const timerId = setInterval(Timer, 1000);
