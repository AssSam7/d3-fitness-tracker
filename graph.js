const margin = { top: 20, right: 20, bottom: 50, left: 100 };
const graphWidth = 560 - margin.right - margin.left;
const graphHeight = 360 - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom);

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes groups
const xAxisGroup = graph
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + graphHeight + ")");

const yAxisGroup = graph.append("g").attr("class", "y-axis");

// Line path generator
const line = d3
  .line()
  .x((d) => x(new Date(d.date)))
  .y((d) => y(d.distance));

// Creating the path
const path = graph.append("path");

// Area for shading below
const area = d3
  .area()
  .x((d) => x(new Date(d.date)))
  .y0(graphHeight)
  .y1((d) => y(d.distance));

// Create the area to shade (group)
const shade = graph.append("g");

// Adding path element to area group
const shadePath = shade.append("path").attr("class", "area");

// update function
const update = (data) => {
  // Create dotted line group and append to the graph
  const dottedLine = graph
    .append("g")
    .attr("class", "lines")
    .style("opacity", 0);

  // Create x dotted line and append to the dotted line group
  const xDotLine = dottedLine
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 4);

  // Create y dotted line and append to the dotted line group
  const yDotLine = dottedLine
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 4);

  // Updated data filtering based on activity
  data = data.filter((item) => item.activity === activity);

  // Sort the data based on dates
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // set scale domains
  x.domain(d3.extent(data, (d) => new Date(d.date)));
  y.domain([0, d3.max(data, (d) => d.distance)]);

  // Update paths
  const updatedPath = path
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", 2)
    .attr("d", line);

  const pathLength = updatedPath.node().getTotalLength();

  const transitionPath = d3.transition().ease(d3.easeSin).duration(1500);

  updatedPath
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);

  // Applying data to shaded path
  shadePath.data([data]).attr("d", area);

  // create axes
  const xAxis = d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %d"));

  const yAxis = d3
    .axisLeft(y)
    .ticks(4)
    .tickFormat((d) => d + "m");

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // Creating the points
  const circles = graph.selectAll("circle").data(data);

  // Update current points
  circles
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance));

  // Add new points
  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance))
    .attr("r", 5)
    .attr("fill", "#ccc")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", 2);

  // Data points (circle) hover effects
  graph
    .selectAll("circle")
    .on("mouseover", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(700)
        .attr("r", 8)
        .attr("fill", "#fff");

      // Set x dotted line coords (x1, x2, y1, y2)
      xDotLine
        .attr("x1", x(new Date(d.date)))
        .attr("x2", x(new Date(d.date)))
        .attr("y1", graphHeight)
        .attr("y2", y(d.distance));

      // Set y dotted line coords (x1, x2, y1, y2)
      yDotLine
        .attr("x1", 0)
        .attr("x2", x(new Date(d.date)))
        .attr("y1", y(d.distance))
        .attr("y2", y(d.distance));

      // Show the dotted line group (.style, opacity)
      dottedLine.style("opacity", 1);
    })
    .on("mouseleave", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(700)
        .attr("r", 4)
        .attr("fill", "gray");

      // Hide the dotted line group
      dottedLine.style("opacity", 0);
    });

  // Exit selection
  circles.exit().remove();

  // rotate axis text
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");
};

// data and firestore
let data = [];

db.collection("fitness-acitivites")
  .orderBy("date")
  .onSnapshot((res) => {
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
