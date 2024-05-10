const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.port || 4000;

app.get("/api/db", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      res.status(500), json({ error: "Internal server error" });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
