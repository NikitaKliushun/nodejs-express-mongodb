const db = require("../models");
const User = db.users;
const Tutorial = db.tutorials;
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new User
exports.create = (req, res) => {

};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {

};

// Find a single User with an id
exports.findOne = (req, res) => {

};

// Find a single User with a Login
exports.findByLogin = (req, res) => {

};

// Update a User by the id in the request
exports.update = (req, res) => {

};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {

};


exports.create = (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!req.body.lastName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!req.body.firstName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!req.body.age) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a User
  const user = new User({
    login: req.body.login,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    age: req.body.age,
    imageData: req.body.imageData
  });

  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.findAll = (req, res) => {

  const { page, size, login } = req.query;
  const { limit, offset } = getPagination(page, size);

//  const login = req.query.login;
  var condition = login ? { login: { $regex: new RegExp(login), $options: "i" } } : {};

  User.paginate(condition, { offset, limit })
  .then((data) => {
    res.send({
      totalItems: data.totalDocs,
      users: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1
    });
  })
  .catch((err) => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users.",
    });
  });

/*  User.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    }); */
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.findByLogin = (req, res) => {

  const login = req.params.login;

  let condition = { login: { $regex: new RegExp("^" + login + "$"), $options: "i" } } ;

  User.findOne(condition)
    .then(data => {
      if (!data) res.status(404).send(false)
      else res.send(true);
    })
    .catch(err => {
      res.status(500).send({message: "Error retrieving User with login " + login})
    });

}


exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  var id = req.params.id;
//  var user = await User.findById(id);
//  console.log(user);
  Tutorial.deleteMany(
    { user: id },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );

  User.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} User were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
    Tutorial.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Tutorials were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all tutorials."
        });
      });
};

/* exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};*/
