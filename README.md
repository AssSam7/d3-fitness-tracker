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

## Real-time data updates ⌛

We can use **onSnapshot()** method of the firestore. This method accepts a call-back as an argument with **res** as its parameter.

1. Apply this method on our collection where the data is stored
2. There are 3 cases of data alteration in firestore
   - **Added**: When a new document is added to the collection.
   - **Modified**: When an existing document properties are altered or new properties are added to an existing document.
   - **Deleted**: When an existing document is deleted.

```javascript
db.collection("budget-planner").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
```

## Graph Metrics 📏

Adding the margins and dimensions of the graph

### 1. Margins

Creating the margin properties using a javascript object

```javascript
const margin = {
  top: 40,
  right: 20,
  bottom: 50,
  left: 20,
};
```

### 2. Dimensions

**Graph width**

```javascript
const graphWidth = 560 - margin.left - margin.right;
```

**Graph height**

```javascript
const graphHeight = 400 - margin.top - margin.bottom;
```

## Creating SVG and Graph group 🎞️

Appending the **SVG** element to the canvas container and creating the graph group with the above dimensions

## 1. SVG

```javascript
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom);
```

## 2. Graph group

```javascript
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("translate", `tranform(${margin.left}, ${margin.top})`);
```

## Scales and Axes ⚖️

### 1. Creating the scales

**Time scale (X)**
Time scale takes the **domain** of the earliest date, latest date and outputs the range of values between **0** and the **graph width** as it's the x-axis

```javascript
const x = d3.scaleTime().range([0, graphWidth]);
```

**Linear scale (Y)**
It takes the **domain** of 0 and the maximum distance and outputs the range of values between **graph height** and **0** as it goes from the top to bottom

```javascript
const y = d3.scaleLinear().range([graphHeight, 0]);
```

### 2. Axes groups

**X-axis Group**

```javascript
const xAxisGroup = graph
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${graphHeight})`);
```

**Y-axis Group**

```javascript
const yAxisGroup = graph.append("g").attr("class", "y-axis");
```

## Initalizing the graph 🏁

### 1. Updating the domains

Domains will be updated based on the data, hence they should be inside the **update()** function

**X-axis domain**

It should be between the minimum date i.e. the earliest and the maximum date i.e. the latest one. To generate both **min** and **max** values, I have used **extent** method of D3.

```javascript
x.domain(d3.extent(data, (d) => new Date(d.date)));
```

**Y-axis domain**

It should be between **0** and **maximum** distance, which could be generated by using **d3.max()**

```javascript
y.domain([0, d3.max(data, (d) => d.distance)]);
```

### 2. Creating the axes

```javascript
const xAxis = d3.axisBottom(x).ticks(4);
const yAxis = d3.axisLeft(y).ticks(4);
```

### 3. Applying the axes on the groups

```javascript
xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);
```

### 4. Formatting the ticks

**X-axis tick format (Dates)**

We can use **%b** for abbreviated months like **Oct**,**Apr** and **%d** for the dates (number).

```javascript
.tickFormat(d3.timeFormat("%b %d"))
```

**Y-axis tick format (Adding 'm')**

```javascript
.tickFormat((d) => d + "m")
```

### 5. Rotating the text of the ticks

```javascript
xAxisGroup
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end");
```
