const fs = require("fs");
const csv = require("csv-parser");

const results = {};

fs.createReadStream("cities.csv")
  .pipe(csv())
  .on("data", (data) => {
    const state = data.state.toLowerCase().replace(/\s/g, "");
    const city = data.city;

    if (!results[state]) {
      results[state] = [];
    }

    results[state].push(city);
  })
  .on("end", () => {
    fs.writeFileSync("cities.json", JSON.stringify(results, null, 2));
    console.log("JSON file created successfully!");
  });