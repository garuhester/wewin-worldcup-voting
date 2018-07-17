var voting = require("./voting");
var admin = require("./admin");
var moment = require("moment");

module.exports = function (app) {

    app.locals.dateFormat = function (date) {
        //YYYY-MM-DD HH:mm:ss
        return moment(date).format("MM月DD日 HH:mm");
    };

    app.locals.stopDateFormat = function (date) {
        var times = new Date(date).getTime();
        times = new Date(times - 180000);
        return moment(times).format("MM月DD日 HH:mm");
    };

    app.get("/worldcup/start", function (req, res) {
        res.render("start", {
            title: "登陆"
        });
    });

    app.get("/worldcup/index", function (req, res) {
        if (req.session.user) {
            res.render("index", {
                title: "世界杯竞猜-主界面",
                userInfo: req.session.user,
            });
        } else {
            res.redirect("/worldcup/start");
        }
    });

    app.get("/worldcup/voting", function (req, res) {
        if (req.session.user) {
            voting.getComp().then(function (data) {
                res.render("voting", {
                    title: "世界杯竞猜-参与竞猜",
                    data,
                    userInfo: req.session.user,
                });
            });
        } else {
            res.redirect("/worldcup/start");
        }
    });

    app.get("/worldcup/rule", function (req, res) {
        if (req.session.user) {
            res.render("rule", {
                title: "世界杯竞猜-游戏规则"
            });
        } else {
            res.redirect("/worldcup/start");
        }
    });

    app.get("/worldcup/admin", function (req, res) {
        admin.getComp().then(function (data) {
            res.render("admin", {
                title: "世界杯竞猜后台",
                data,
            });
        });
    });

    app.get("/worldcup/myvoting", function (req, res) {
        if (req.session.user) {
            var userId = req.session.user._id;
            voting.getMyVoting(userId).then(function (data) {
                res.render("myvoting", {
                    title: "世界杯竞猜-我的竞猜",
                    data,
                    userInfo: req.session.user,
                });
            });
        } else {
            res.redirect("/worldcup/start");
        }
    });

    app.get("/worldcup/charts/:cid", function (req, res) {
        var cid = req.params.cid;
        res.render("charts", {
            title: "世界杯竞猜-图表",
            cid,
        });
    });

    app.post("/intoVoting", voting.intoVoting);

    app.post("/submitScore", voting.submitScore);

    app.post("/addComp", admin.addComp);

    app.post("/initData", admin.initData);

    app.post("/getUserList", admin.getUserList);

}