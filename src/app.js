const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const waletRoutes = require("./routes/wallet.routes");

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'hbs');

// const corsOptions = {origin: "http://localhost:3000"};
const corsOptions = {};
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application" });
});

app.use("/api", waletRoutes);

module.exports = app;
