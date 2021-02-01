module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/:id", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  // Retrieve all published Tutorials
  router.get("/published/", tutorials.findAllPublished);

  // Retrieve all User's Tutorials
  router.get("/user/:id", tutorials.findAllByUser);

/*  // Retrieve all published User's Tutorials
  router.get("/published/user/:id", tutorials.findAllPublishedByUser);

  // Delete all User's Tutorials
  router.delete("/user/:id", tutorials.deleteAllByUser); */


  app.use('/api/tutorials', router);
};
