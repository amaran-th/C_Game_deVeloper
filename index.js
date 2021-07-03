const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "ejs");

var mainRouter = require("./router/main");
var choiceRouter = require("./router/choice");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/',mainRouter);
app.use('/choice',choiceRouter);

app.listen(app.get('port'),function(){
    console.log('[Listening] localhost @',app.get('port'));
});