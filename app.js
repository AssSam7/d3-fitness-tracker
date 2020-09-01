// DOM Elements
const btns = document.querySelectorAll("button");
const form = document.querySelector("form");
const formActivity = document.querySelector("form span");
const input = document.querySelector("input");
const errMsg = document.querySelector(".error");

let activity = "cycling";

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Get activity
    activity = e.target.dataset.activity;

    // Get active button
    const activeBtn = document.querySelector(`button[class="active"]`);

    // Remove 'active' class from that button
    activeBtn.classList.remove("active");

    // Add 'active' class on the current clicked button
    btn.classList.add("active");

    // Update the activity to the current clicked activity
    formActivity.textContent = activity;

    // Set id of the input field with current activity
    input.setAttribute("id", activity);
  });
});
