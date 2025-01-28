// Express Server
const express = require("express");
const app = express();
const port = 3000;

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

app.get("/", (req, res) => {
  const options = {
    title: "Comments",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit."
  };
  res.render("index", options);
});


// Middleware - Parses requests' BODY

// Import body-parser package to better 
// handle client data from POST + PATCH
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json({ extended: true }))


//Middleware - parses client req.body JSON from POST + PATCH
//app.use(express.urlencoded()); 
app.use(express.json()); 


// Import routes
//const animeRte = require("./routes/animeRte")
const mockRte = require("./routes/mockRte");
//const mtgRte = require("./routes/mtgRte")



// Middleware - Logging requests
// Helps keep track of reqs during testing
// Req, path, req date + time
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

// =============================
// Current TODO
// =============================

// Using New Routes
//app.use("/animeData", animeRte)
app.use("/mockData", mockRte)
//app.use("/mtgData", mtgRte)


// ====================================
/////// Reference /////////
//
// Use comments to explain why not what - code should be self-explanatory about what it does; Comments should explain reasoning behind code
// X If  purpose or logic isn't obvious, describe the intention. But restating the code (how it works & what it's doing) in plain language is not a good use
// X Comments when functions have explicit names that describe what they're doing
// https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript#comments
// https://javascript.info/comments
//
//
//
//
// res.send - take a non-json object or array and turn it in to another type
// res.json - converts response to JSON object, including non-objs (null, undefined). 
//     eventually calls res.send, but before that it:
//     1. respects the json spaces and json replacer app settings (passes to JSON.stringify)
//     2. ensures the response will have utf-8 charset and application/json Content-Type
//
//
// W/in app.<method()>'s block - constructs a 
// response for each endpoint based on the 
// reading & writing of file data
//
//
// app.route() - route handler that returns instance of a single route, 
// but is chainable ex. handles GET, POST, DELETE for that single route 
// in one function. Think of it as route specific middleware
//
// router object is an instance of middleware and route
// express.Router() - class to create a new route object. A Router instance is a complete middleware and routing system. Used to create modular, mountable route handlers. HTTP method routes (CRUD) can be added.
//
//
//
//////////////////////////

// Commit - "Started restructuring data, began transitioning from `app` to `router` for modularity, added additional mock databases for testing."


///// CRUD /////

// Index Route
// API Route
// Data Route
// Data Property Route

// GET - read
// PATCH - update
// POST / PUT - creates new
// DELETE - delete


//// Index Route ////

// GET

// app.get("/", (req, res) => {
//   res.send("home");
// });



// id: 
// name: 
// picture: 
// pet: 

// ====================================

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
