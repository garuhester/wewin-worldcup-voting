var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String, // 姓名
    department: String, // 所属部门
    createTime: {
        type: Date,
        default: Date.now
    } // 创建时间
});

module.exports = mongoose.model("User", UserSchema);