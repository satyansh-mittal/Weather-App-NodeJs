const weatherData = require("../utils/weatherData");


const hello = async (req, res) => {
    res.render("index", { title: "Weather App" });
};

const other = async (req, res) => {
    res.render("404", { title: "Page not found" });
};

const getWeather = async (req, res) => {
    if (!req.query.address) {
        return res.send("Address is required");
    }
    weatherData(req.query.address, (error, result) => {
        if (error) {
            return res.send(error);
        }

        res.send(result);
    });
};

module.exports = {
    hello,
    other,
    getWeather,
}