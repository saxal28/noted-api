const mongoose = require("mongoose");
const {app} = require("../app")
mongoose.Promise = global.Promise;

mongoose.connect(process.env.PORT ?
  "mongodb://saxal28:gatorade2@ds139979.mlab.com:39979/notedapi" :
  "mongodb://localhost:27017/noted");
