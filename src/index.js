var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var xlsx = require("node-xlsx").default;

var app = express();
var jsonParser = bodyParser.json();


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// получение списка данных
app.get("/", function (req, res) {


    var dataxlsx = xlsx.parse("src/test.xlsx");
    var data1 = dataxlsx[0].data
    var data = [];
    for (var i = 1; i < data1.length-1; i++) {

        if (data1[i][7] != "") {
            var arr = {}
            arr.adress = data1[i][3];
            arr.size = data1[i][5];
            arr.liter = data1[i][7];
            arr.city = data1[i][4];
            data.push(arr)
        }
    }

    res.send(data)
});
app.post("/", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var numberTk = req.body.number;
    var cityTk = req.body.city;
    var adressTk = req.body.adress;
    var newTk = {
        number: numberTk,
        city: cityTk,
        adress: adressTk
    };

    var data = fs.readFileSync("./src/data.json", "utf8");
    var tk = JSON.parse(data);

    tk.push(newTk);
    var data = JSON.stringify(tk);
    fs.writeFileSync("./src/data.json", data);
    res.send(newTk);
});

app.listen(8081, function () {
    console.log("Сервер ожидает подключения...");
});