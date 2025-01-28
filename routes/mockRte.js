const express = require("express");
const router = express.Router(); // Route handler

const mockData = require("../data/mockData");


// =============================
// Current TODO
// =============================
// --> Keep code to mock for now so I don't have to update everywhere else. Then when finished add to other routes
// POST needs "more robust validation"



// GET + POST
router
  .route("/")
  .get((req, res) => {
    res.json(mockData);
  })
  // Creating a new user
  .post((req, res) => {
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


// GET + PATCH + DELETE
router
  .route("/:id")
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


module.exports = router;