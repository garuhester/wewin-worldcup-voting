var User = require("../schemas/user");
var Competition = require("../schemas/competition");

//新增场次
var addComp = function (req, res) {
    var teamOneName = req.body.teamOneName;
    var teamOneImg = req.body.teamOneImg;
    var teamTwoName = req.body.teamTwoName;
    var teamTwoImg = req.body.teamTwoImg;
    var beginTime = req.body.beginTime;

    var comp = new Competition({
        teamOneName,
        teamOneImg,
        teamTwoName,
        teamTwoImg,
        beginTime,
    });

    comp.save(function (err, comp) {
        res.json({ result: 1 });
    });
}

//获取后台数据
var getComp = function () {
    return new Promise(function (resolve, reject) {
        var data = {};
        Competition.find({}).sort({ 'beginTime': 1 }).exec(function (err, comp) {
            data.comp = comp;
            resolve(data);
        });
    });
}

//初始化数据
var initData = function (req, res) {
    Competition.update({}, { '$set': { "userList": [] } }, { multi: true }, function (err, result) {
        res.json({ result: 1 });
    });
}

//获取竞猜列表
var getUserList = function (req, res) {
    var cId = req.body.cId;
    var type = req.body.type;
    var chooseResult = req.body.chooseResult;

    var data = {};
    Competition.findById(cId).populate('userList.userId', 'name department').exec(function (err, comps) {
        var userList = comps.userList;
        var scores = [],
            newUserList = [];
        if (type == 0) {
            for (var i = 0; i < userList.length; i++) {
                var ul = userList[i];
                if (scores.indexOf(ul.chooseResult) == -1) {
                    scores.push(ul.chooseResult);
                }
            }
        } else if (type == 1) {
            for (var i = 0; i < userList.length; i++) {
                var ul = userList[i];
                if (ul.chooseResult == chooseResult) {
                    newUserList.push(ul);
                }
            }
        }
        data.scores = scores;
        data.newUserList = newUserList;
        data.comps = comps;
        res.json(data);
    });
}

module.exports = {
    addComp,
    getComp,
    initData,
    getUserList,
}