var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require("moment");

var schema = new Schema({
    meta_data: {
        user:  [{ type: Schema.Types.ObjectId, ref: 'corUser' }],
        date: Date
    },
    visits: Number
}, {read: 'secondaryPreferred' });

userMetrics = mongoose.model("corUserMetrics", schema);

userMetrics.saveMetrics = function(user, fn) {
    var conditions, values, options;
    conditions = {
        "meta_data.user":user,
        "meta_data.date": moment.utc().startOf("day").format()
    };
    values = {
        "meta_data.user":user,
        "meta_data.date": moment.utc().startOf("day").format(),
        $inc: {visits: 1}
    };
    options = {upsert: true};

    userMetrics.findOneAndUpdate(conditions, values, options).exec(fn);
}
