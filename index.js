const express = require("express");

// Import body-parser package to better 
// handle client data from POST + PATCH
const bodyParser = require("body-parser");

// Import Data - Soon to be obsolete/removed
const animeData = require("./data/animeData")
const mockData = require("./data/mockData")
const mtgData = require("./data/mtgData")

// Import routes
const animeRte = require("./routes/animeRte")
const mockRte = require("./routes/mockRte")
const mtgRte = require("./routes/mtgRte")

// Setup server
const app = express();
const port = 3000;

//why isn't this needed?
//Middleware - parses JSON req & puts in req.body
//app.use(express.json()); 

// Middleware - Parses requests' BODY
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))


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
app.use("", animeRte)
app.use("", mockRte)
app.use("", mtgRte)

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

/*
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

app.get("/", (req, res) => {
  res.send("home");
});

// Does using route matter for "/"?
// app
//   .route("/")
//   .get((req, res) => {
//     res.json("home")
//   })


// Do I even need a delete here?
// DELETE
app.delete("/", (req, res) => {
  res.send("delete");
});



//// API Route ////

// GET
app.get("/api", (req, res) => {
  res.send("get");
});

// Not sure if needed here
// app
//   .route("/api")
//   .get((req, res) => {
//     res.json()
//   })

// May not need any of these. Can change to use a diff DB later
// POST
app.post("/api", (req, res) => {
  res.send("post");
});


// PUT
app.put("/api", (req, res) => {
  res.send("put");
});

// PATCH
app.patch("/api", (req, res) => {
  res.send("patch");
});


//// Entire Database Route ////

// GET
app.get("/api/data", (req, res) => {
  //res.send("data");
  res.json(mockData);
});
// ====================================
// ^Currently only points to mockData database
// v Template for all routes
// ====================================

// id: 
// name: 
// picture: 
// pet: 


// POST needs "more robust validation"
// --> Keep code to mock for now so I don't have to update everywhere else. Then when finished add to other routes
app
  .route("/api/data")
  .get((req, res) => {  // GET
    res.json(mockData);
  })
  // Creating a new user
  .post((req, res) => { // POST
    if (req.body.id && req.body.name && req.body.picture && req.body.pet)  { //verify all needed data present
      if (mockData.find((n) => n.name == req.body.name)) { //if new value is same as old value, return error
        res.json({ error: "You already have an account" });
        return;
      }

      const user = { //make new user obj w/ all needed data fields
        id: [mockData.length - 1].id + 1, //Take length of array, -1 to find next available index, create the next available ID #
        name: req.body.name,
        picture: req.body.picture,
        pet: req.body.pet,
      };

      mockData.push(user); // add new user to the database array
      res.json([mockData.length - 1]); // return the last obj in the database array 
    } else res.json({ error: "Please complete the signup form" });
      // Incomplete attempt if seeing if I could return the value they forgot w/in the error
      // {
      //   if ((req.body.id == null|| req.body.name == null || req.body.picture == null || req.body.pet == null)) {
      //     res.json({ error: "You already have an account" });
      //   }
      // }
  });


// PUT
app.put("/api", (req, res) => {
  res.send("put");
});

// PATCH
app.patch("/api", (req, res) => {
  res.send("patch");
});






//// Database Property Route ////

// GET
// Searches mock data response obj for an ID & returns specified param
app.get("/api/data/:id", (req, res, next) => {
  const userID = mockData.find((i) => i.id == req.params.id);
  if (userID) res.json(userID);
  else next();
});

// PATCH
app
  .route("/api/data/:id")
  .get((req, res, next) => {
    const userID = mockData.find((i) => i.id == req.params.id);
    if (userID) res.json(userID);
    else next();
  })
  .patch((req, res, next) => { // PATCH
    const user = mockData.find((u, i) => {
      if (u.id == req.params.id) { // if the ID provided matches an existing ID
        for (const key in req.body) { // loop through the request body
          mockData[i][key] = req.body[key]; // look at index i & index key, then set key to key in req body (i.e., overwrite it with new value from user)
      }
      return true; // value has successfully been changed
    }});

    //if the function above returns true
    if (user) res.json(user); // if PATCH is able to run (i.e., returns T), convert the returned res obj & return the data to the client
    else next; // Otherwise throw an error
  })
  // DELETE
  .delete((req, res, next) => {
    const user = mockData.find((u, i) => {
      if (u.id == req.params.id) {
        mockData.splice(i, 1) // remove an item from the array at position i & # of elements to remove = deletes entire user from DB
        return true;
      }
    });

    if (user) res.json(user); // if DELETE is able to run (i.e., returns T), convert the returned res obj & return the deleted user to the client
    else next; //otherwise throw an error
  });

*/

///// Middleware - Errors /////

// Error Test
// Middleware - General error handler
app.use((req, res) => {
  res.status(404);
  res.json({error: "Error"})
});



// Middleware - 404 not found
// app.use((req, res, next) => {
//   next(error(404, "Not Found"))
// });


// Slide 41
// Middleware - General error handler
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({error: + err.message})
// });



app.listen(port, () => {
  console.log(`Server listening to ${port}`);
});
