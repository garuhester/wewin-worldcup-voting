var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CompetitionSchema = new Schema({
    teamOneName: String,
    teamOneImg: String,
    teamTwoName: String,
    teamTwoImg: String,
    beginTime: Date,
    userList: [{
        userId: {
            type: String,
            ref: 'User'
        },
        chooseResult: String, // 选择结果(比分：3比1)
        chooseTime: {
            type: Date,
            default: Date.now
        }
    }],
    createTime: {
        type: Date,
        default: Date.now
    } // 创建时间
});

module.exports = mongoose.model("Competition", CompetitionSchema);