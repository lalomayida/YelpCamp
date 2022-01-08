const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Yelp Camp is running");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
