<h1 align="center">Fitness Tracker 🏃</h1>
<p align="center">
  <img src="https://img.shields.io/badge/materialize-v1.0-ff69b4">
  <img src="https://img.shields.io/badge/D3.js-v5-important">
  <img src="https://img.shields.io/badge/firebase-v7.19.0-yellow">
</p>

> A simple fitness tracker app with minimal visualizations and data feeding. This project is a part of the course by **Shaun (Net ninja)** at Udemy.

## Demo 🪁

https://romantic-mayer-ac2e7c.netlify.app/

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

## Tech Stack 👩‍💻

- Materialize CSS
- Javascript (ES6+)
- D3.JS
- Firebase (Firestore)
