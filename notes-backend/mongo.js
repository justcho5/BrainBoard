const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const Note = require("./models/note");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });
Note.insertMany([
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "content2",
    important: false,
  },
]).then(() => console.log("Data inserted")); // Success

mongoose.connection.close();
