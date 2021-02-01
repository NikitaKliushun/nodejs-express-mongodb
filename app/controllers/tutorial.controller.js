const db = require("../models");
const Tutorial = db.tutorials;
const User = db.users;
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Retrieve all User's Tutorials from the database.
exports.findAllByUser = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};
/*
// Delete all User's Tutorials
exports.deleteAllByUser = (req, res) => {

};

// Find all published User's Tutorials
exports.findAllPublishedByUser = (req, res) => {

}; */

exports.create = async (req, res) => {
  // Validate request
  try {
    if (!req.body.title) {
      res.status(400).send({message: "Title can not be empty!"});
      return;
    }

    // Create a Tutorial
    const userID = req.params.id;
    const tutorial = new Tutorial({
      title: req.body.title,
      description: req.body.description,
      user: userID,
      published: req.body.published ? req.body.published : false
    });

    // Save Tutorial in the database
    const data = await tutorial.save(tutorial);

    if (!data) {
      res.status(400).send({
        message:
            "Some error occurred while creating the Tutorial."
      });
      return;
    }

    const user = await User.findByIdAndUpdate(userID, {$push: {tutorials: tutorial.id}}, {useFindAndModify: false});
    if (!user) {
      res.status(404).send({
        message: `Cannot update User with id=${userID}. Maybe User was not found!`
      });
      return;
    }

    res.send(data);
  } catch (e) {
    res.status(500).send({
      message: "Error",
    });
  }

};

/*  exports.findAllByUser = (req, res) => {
  const title = req.query.title;
  const id = req.params.id;
  var condition = title ? {
                            title: { $regex: new RegExp(title), $options: "i" },
                            id: id
                          } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}; */

exports.findAll = (req, res) => {

  const { page, size, title } = req.query;


//  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  const { limit, offset } = getPagination(page, size);

/*  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });*/

    Tutorial.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

/* exports.findAllByUser = (req, res) => {
  const userID = req.params.id;

  User.findById(userID).populate("tutorials")
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

exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

exports.delete = (req, res) => {

  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else {
            const userID = data.user._id;
            User.findByIdAndUpdate(userID, { $pull: { tutorials: id } }, { useFindAndModify: false })
              .then(data => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot update User with id=${userID}. Maybe User was not found!`
                  });
                } else res.send({ message: "User was updated successfully." });
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating User with id=" + userID
                });
              });
           }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });

  Tutorial.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

/* exports.deleteAllByUser = (req, res) => {
  const id = req.params.id;
  Tutorial.deleteMany({ id: id })
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
};*/

exports.deleteAll = (req, res) => {
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

/* exports.findAllPublishedByUser = (req, res) => {
  const id = req.params.id;
  Tutorial.find({
                  published: true,
                  id: id
                })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}; */

exports.findAllPublished = (req, res) => {

  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

/*  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    }); */

    Tutorial.paginate({ published: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });

};

exports.findAllByUser = (req, res) => {

  const userID = req.params.id;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

    Tutorial.paginate({ user: userID }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials1: data.docs,
        totalPages1: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });

};
