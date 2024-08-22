const mongoose = require("mongoose");

const mongoUri = "mongodb://127.0.0.1/crudAuthApp";
const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Db connected!");
  } catch (error) {
    console.log(error.message);
    console.error(error);
  }
};
module.exports = connectToDb;
