// Express Server
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser")
const { error } = require("console");
const { title } = require("process");



// Template Engine
app.use(express.static("public"));

const fs = require("fs");

app.engine("template", (filePath, options, callback) => {
  fs.readFile(filePath, (error, text) => {
    if (error) return callback(error);

    const templateRender = text
      .toString()
      .replaceAll("#title#", `${options.title}`)
      .replace("#text#", `${options.text}`)
    return callback(null, templateRender);
  })
});

app.set("views", "./views");
app.set("view engine", "template");

// Render for root route
app.get("/", (req, res) => {
  //res.json("Home");
  res.render("root");
});


///// Middleware /////

// Parser
//app.use(express.urlencoded()); 
//app.use(express.json()); 

// Body Parser
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); 

// Logging requests
app.use((req, res, next) => {
  const logTime = new Date();
  console.log(
    `------
    ${logTime.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Data contained: ");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

///// Routes /////
// Import routes
const animeRte = require("./routes/animeRte")
const mockRte = require("./routes/mockRte");
const mtgRte = require("./routes/mtgRte")

// Using New Routes
app.use("/animeData", animeRte)
app.use("/mockData", mockRte)
app.use("/mtgData", mtgRte)

///// Middleware - Errors /////
// 404 not found
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"))
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message })
});


app.listen(port, () => {
  console.log(`Server listening to ${port}`);
});