var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var mongodb = require('./ConnectMongodb');

//初始化路由
var route = require('./routes/index');

var app = express();

//ejs
app.set('views', './views/pages'); //设置视图根目录
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//初始化静态资源
app.use(express.static('./static'));

//初始化body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//初始化session和cookie
app.use(cookieParser('name'));
app.use(session({
    secret: 'name',
    name: 'name',
    resave: true,
    cookie: {
        maxAge: 3600000
    },
    saveUninitalized: true,
}));

//连接数据库
mongodb.connect();

app.listen(8080, function (err) {
    if (err) return err;
    console.log("http://localhost:8080/worldcup/start");
});

route(app);