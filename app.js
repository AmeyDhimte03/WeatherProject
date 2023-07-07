require("dotenv").config();
const express = require("express");
const https = require("https");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.post("/", (req, res) => {
  const query = req.body.CityName;
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    process.env.API_ID;
  https.get(url, (response) => {
    // console.log(response.statusCode);
    response.on("data", (dta) => {
      const data = JSON.parse(dta);
      // console.log(data);
      if (data.cod==200) {
        const weatherDes = data.weather[0].description;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const weatherIcon = data.weather[0].icon;
        const imgURL =
          "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        // res.write(
        //   "<h1>Today's weather in " +
        //     query +
        //     " could be described as " +
        //     weatherDes +
        //     "<br> with tempearture of " +
        //     temp +
        //     " degrees celcius & humidity as " +
        //     humidity +
        //     "</h1>"
        // );
        // res.write("<img src=" + imgURL + ">");
        // return res.send();
        res.render("result",{query:query,weatherDes:weatherDes , temp:temp, humidity:humidity, imgURL:imgURL})
      } else {
        res.write(data.message);
        res.send();
      }
    });
  });
});
app.listen("3000", () => {
  console.log("server running at port 3000");
});
