const express = require("express");
const router = express.Router();
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
    if (req.body.id && req.body.name && req.body.picture && req.body.pet)  {
      if (mockData.find((n) => n.name == req.body.name)) {
        res.json({ error: "You already have an account" });
        return;
      }

      const user = {
        id: [mockData.length - 1].id + 1,
        name: req.body.name,
        picture: req.body.picture,
        pet: req.body.pet,
      };

      mockData.push(user);
      res.json([mockData.length - 1]);
    } else res.json({ error: "Please complete the form" });
  });


// GET + PATCH + DELETE
router
  .route("/:id")
  .get((req, res, next) => {
    const userID = mockData.find((i) => i.id == req.params.id);
    if (userID) res.json(userID);
    else next();
  })
  .patch((req, res, next) => {
    const user = mockData.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          mockData[i][key] = req.body[key];
      }
      return true;
    }});
    if (user) res.json(user);
    else next;
  })
  .delete((req, res, next) => {
    const user = mockData.find((u, i) => {
      if (u.id == req.params.id) {
        mockData.splice(i, 1)
        return true;
      }
    });

    if (user) res.json(user);
    else next;
  });


module.exports = router;