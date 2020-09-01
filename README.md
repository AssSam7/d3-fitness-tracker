<h1 align="center">Fitness Tracker 🏃</h1>
<p align="center">
  <img src="https://img.shields.io/badge/materialize-v1.0-ff69b4">
  <img src="https://img.shields.io/badge/D3.js-v5-important">
  <img src="https://img.shields.io/badge/firebase-v7.19.0-yellow">
</p>

> A simple fitness tracker app with minimal visualizations and data feeding. This project is a part of the course by **Shaun (Net ninja)** at Udemy.

## Demo 🪁

https://romantic-mayer-ac2e7c.netlify.app/

## Tech Stack 👩‍💻

- 🌈 Materialize CSS
- 🟨 Javascript (ES6+)
- 🖋️ D3.JS
- 🗃️ Firebase (Firestore)

## Getting Started 🚀

### 1. D3.js CDN

Add the following **CDN** at the end of the **body** tag in the **index.html**

```html
<script src="https://d3js.org/d3.v5.js"></script>
```

### 2. Firebase CDN

Get the below code from console.firebase.google.com and check out, Adding this project to the web app

```html
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-firestore.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDQQN1E2V8K8wFqjHKiSjimAHvjagZst0k",
    authDomain: "d3-firebase-starter.firebaseapp.com",
    databaseURL: "https://d3-firebase-starter.firebaseio.com",
    projectId: "d3-firebase-starter",
    storageBucket: "d3-firebase-starter.appspot.com",
    messagingSenderId: "1020387918909",
    appId: "1:1020387918909:web:508221bf07b68bc2079654",
    measurementId: "G-XJ376VQ9BE",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
</script>
```

## DOM Elements 🌲

These are the DOM elements which would be updated on a timely basis based on the back-end data.

```javascript
const btns = document.querySelectorAll("button");
const form = document.querySelector("form");
const formActivity = document.querySelector("form span");
const input = document.querySelector("input");
const errMsg = document.querySelector(".error");
```

## Fitness Activity Buttons 🔲

These are the activity button which determine the type of the fitness activity like running, swimming, walking etc. Here those buttons **active** class needs to be changed on every click i.e. if **Running** button is clicked, it's class list should be added with **active** class and the current button element holding the active class needs to be removed.

```javascript
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
```

## Storing the data from the FORM 📋

On every form submit, validating the input fields and creating a new document in the **fitness-activities** collection with the form values

### 1. Prevent the default behaviour

```javascript
form.addEventListener("submit", (e) => {
  // Prevent the default action
  e.preventDefault();
});
```

### 2. Getting the distance from the input field

As the form values are string, they need to be converted to **integer** before sending them to the database

```javascript
const distance = parseInt(input.value);
```

### 3. Validations

Store the distance if entered, else populate an error message

```javascript
if (distance) {
    ...
    ...
    ...
  } else {
    errMsg.textContent = "Please enter the distance";
  }
```

### 4. Create a new document and add it to the firestore

The new document would consist of the following fields

1. Distance (in mts)
2. Activity
3. Date (Current timestamp)

```javascript
db.collection("fitness-acitivites").add({
  distance,
  activity,
  data: new Date().toString(),
});
```

### 5. Form reset

If everything goes well and document is stored, clear the input fields and any error message.

```javascript
.then(() => {
  errMsg.textContent = "";
  input.value = "";
});
```
