var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require("moment");

var schema = new Schema({
    uuid: String,
    email: String,
    age: String,
    city: String,
    country: String,
    facebookId: String,
    firstName: String,
    gender: String,
    isAnonymous: Boolean,
    accountId: String,
    lastName: String,
    name: String,
    zip: String,
    brand: String,
    language: String
}, {read: 'secondaryPreferred' });

var user = mongoose.model("corUser", schema);

user.saveUser = function(u, fn) {
    var conditions, values, options;
    if (u.isLoggedIn) {
        conditions = {accountId: u.isLoggedIn};
    } else {
        conditions = {uuid: u.uuid};
    }

    options = {multi: true, upsert: true};
    values = u;
    values.brand = u.brand;
    (u.isAnonymous) ? values.accountId = null: values.accountId = u.isLoggedIn;
    user.findOneAndUpdate(conditions, values, options).exec(fn);
}
