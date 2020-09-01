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
