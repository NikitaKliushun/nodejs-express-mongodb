const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.Promise = global.Promise;

const fileSchema = new mongoose.Schema({
    meta_data:{}
});

mongoose.model("file",fileSchema);

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose, mongoosePaginate);
db.users = require("./user.model.js")(mongoose, mongoosePaginate);

module.exports = db;
