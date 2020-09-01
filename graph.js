// Defining the margin properties
const margin = {
  top: 40,
  right: 20,
  bottom: 50,
  left: 20,
};

// Graph dimensions
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

// Appending SVG to the canvas container
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom);

// Creating the graph group
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("translate", `tranform(${margin.left}, ${margin.top})`);

// Creating the scales
// Time scale for x-axis
const x = d3.scaleTime().range([0, graphWidth]);

// Linear scale for y-axis
const y = d3.scaleLinear().range([graphHeight, 0]);

// Axes groups
const xAxisGroup = graph
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append("g").attr("class", "y-axis");

// Update function to re-render the visualizations
const update = (data) => {
  console.log(data);
};

// Global data
let data = [];

// Real-time firestore updates
db.collection("fitness-acitivites").onSnapshot((res) => {
  // Getting all the docChanges
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    // Doc based on the change type
    switch (change.type) {
      // If it's a new doc, directly push that doc
      case "added":
        data.push(doc);
        break;

      // If existing doc is modified, get the doc and replace that doc
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;

      // If existing doc is removed, get the doc and delete it
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;

      // Default case
      default:
        break;
    }
  });

  // Update the visualizations
  update(data);
});
