const express = require("express");

const app = express();
const port = 3000;

// Import fake data
const mockData = require("./data.js")


//Middleware - parses JSON req & puts in req.body
app.use(express.json());


///// CRUD /////


// READ - get all items

app.get("/", (req, res) => {
  res.send("home");
});

app.get("/api", (req, res) => {
  res.send("get");
});

app.get("/api/data", (req, res) => {
  //res.send("data");
  res.json(data);
});

app.get("/api/data/:name", (req, res) => {
  //res.send("data");
  const item = mockData.find((i) => i.name == req.params.name)
  if (item) res.json(item);
});


// POST - creates new item
app.post("/api", (req, res) => {
  res.send("post");
});


// PATCH / PUT - Update an item
app.put("/api", (req, res) => {
  res.send("put");
});

app.patch("/api", (req, res) => {
  res.send("patch");
});



// DELETE - delete an item
app.post("/", (req, res) => {
  res.send("delete");
});







app.listen(port, () => {
  console.log(`Server listening to ${port}`);
});
