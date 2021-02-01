module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve a single User with login
  router.get("/login/:login", users.findByLogin);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all published Tutorials
//  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};
