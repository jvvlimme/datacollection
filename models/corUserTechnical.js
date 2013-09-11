var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require("moment");

var schema = new Schema({
    user:  [{ type: Schema.Types.ObjectId, ref: 'corUser' }],
    resolution: String,
    language: String,
    browser: String,
    os: String,
    isp: String
}, { read: 'secondaryPreferred' });

userTechnical = mongoose.model("corUserTechnical", schema);

userTechnical.saveTechnical = function(ut, fn) {
    var conditions, values, options;
    console.log(ut);
    conditions = {user: ut.user};
    values = ut;
    options = {upsert:true};
    userTechnical.findOneAndUpdate(conditions, values, options).exec(fn);
}