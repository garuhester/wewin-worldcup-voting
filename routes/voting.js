var User = require("../schemas/user");
var Competition = require("../schemas/competition");
var moment = require("moment");

function GetDateStr(AddDayCount) {
    var dd = new Date("2018-06-14 22:00:00");
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

//进入投票
var intoVoting = function (req, res) {
    var votingName = req.body.votingName;
    var votingDepartment = req.body.votingDepartment;

    var findStr = {
        name: votingName,
        department: votingDepartment,
    };
    User.findOne(findStr, function (err, u1) {
        if (u1 == null) {
            var user = new User({
                name: votingName,
                department: votingDepartment,
            });
            user.save(function (err, u2) {
                req.session.user = u2;
                res.json({ result: 1, user: u2 });
            });
        } else {
            req.session.user = u1;
            res.json({ result: 1, user: u1 });
        }
    });
}

//获取场次数据
var getComp = function () {
    return new Promise(function (resolve, reject) {
        var data = {};
        var date = new Date();
        var nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        var nextDate2 = new Date(date.getTime() + 24 * 60 * 60 * 1000 * 2);
        nextDate = moment(date).format("YYYY-MM-DD 00:00:00").toString();
        nextDate2 = moment(nextDate2).format("YYYY-MM-DD 00:00:00").toString();
        Competition.find({
            "$and": [{
                "beginTime": {
                    "$gte": nextDate
                }
            }, {
                "beginTime": {
                    "$lt": nextDate2
                }
            }]
        }).sort({ 'beginTime': 1 }).exec(function (err, comp) {
            data.comp = comp;
            resolve(data);
        });
    });
}

//提交竞猜场次
var submitScore = function (req, res) {
    var compId = req.body.compId;
    var userId = req.body.userId;
    var chooseResult = req.body.chooseResult;

    Competition.findById(compId, function (err, comp) {
        var nowDate = new Date().getTime();
        var bt = comp.beginTime.getTime() - 180000;
        if (nowDate - bt < 0) {
            Competition.find({ '_id': compId, 'userList': { '$elemMatch': { 'userId': userId } } }, function (err, c1) {
                //已经投过
                if (c1.length != 0) {
                    res.json({ result: 0 });
                } else { // 第一次投
                    var updateStr = {
                        userId,
                        chooseResult,
                    }
                    Competition.findByIdAndUpdate(compId, { '$push': { 'userList': updateStr } }, function (err, c2) {
                        res.json({ result: 1 });
                    });
                }
            });
        } else {
            //投票已截止
            res.json({ result: 2 });
        }

    });
}

//我的竞猜
var getMyVoting = function (userId) {
    return new Promise(function (resolve, reject) {
        var data = {};
        Competition.find({}).sort({ 'beginTime': 1 }).exec(function (err, comp) {
            var allData = [];
            for (var i = 0; i < comp.length; i++) {
                allData[i] = {};
                allData[i].teamOneName = comp[i].teamOneName;
                allData[i].teamTwoName = comp[i].teamTwoName;
                allData[i].beginTime = comp[i].beginTime;
                if (comp[i].userList.length != 0) {
                    for (var j = 0; j < comp[i].userList.length; j++) {
                        var u = comp[i].userList[j];
                        if (u.userId == userId) {
                            allData[i].myScore = u.chooseResult;
                            break;
                        } else {
                            allData[i].myScore = "无";
                        }
                    }
                } else {
                    allData[i].myScore = "无";
                }
            }
            data.allData = allData;
            resolve(data);
        });
    });
}

module.exports = {
    intoVoting,
    getComp,
    submitScore,
    getMyVoting,
}