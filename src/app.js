const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherData = require("../utils/weatherData");
const controller = require("../controllers/controller");

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");

const viewsPath = path.join(__dirname, "../templates/views");

const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

app.get("", controller.hello);

app.get("/weather", controller.getWeather);

app.get("*", controller.other);

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
