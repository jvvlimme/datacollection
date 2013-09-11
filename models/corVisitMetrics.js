var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require("moment");

var schema = new Schema({
    user:  [{ type: Schema.Types.ObjectId, ref: 'corUser' }],
    page: [{ type: Schema.Types.ObjectId, ref: 'corPage' }],
    date: Date,
    referrer: String
}, {read: 'secondaryPreferred' });

var visitMetrics = mongoose.model("corVisitMetrics", schema);

visitMetrics.saveMetrics = function(metrics, fn) {
    var vm = new visitMetrics(metrics);
    vm.date = moment.utc().format();
    vm.save(fn);
}