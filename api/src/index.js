const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const needRoutes = require("./router/reporitngNeed");
const authMiddleware = require("./middleware/authMiddleware");

const cors = require("cors");
const userRoutes = require("./router/userRoutes");

const { connectDB } = require("./db/index");
const port = process.env.PORT || 2000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// app.use(authMiddleware);

app.use("/api/auth", userRoutes);
app.use("/api/needs", authMiddleware, needRoutes);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
connectDB();
