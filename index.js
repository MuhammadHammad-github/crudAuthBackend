const connectToDb = require("./connectToDb");
const cors = require("cors");
const express = require("express");
const app = express();
const route = require("./routes/route");
connectToDb();
app.use(cors());
app.use(express.json());
app.use("/api/auth", route);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
