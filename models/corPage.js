var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require("moment");

var schema = new Schema({
    path: String,
    art_author: String,
    art_id: String,
    art_origin: String,
    art_publ_date: String,
    art_publ_time: String,
    art_source: String,
    art_tags: String,
    art_title: String,
    art_type: String,
    page_cityname: String,
    page_facebookpageurl: String,
    page_mainsection: String,
    page_mainsectionname: String,
    page_mainsubsection: String,
    page_mainsubsectionname: String,
    page_maintag: String,
    page_papercode: String,
    page_sectionname: String,
    page_secure: Boolean,
    page_type: String,
    page_zipcode: String,
    section: String,
    webRoot: String,
    websiteFolder: String
}, {read: 'secondaryPreferred' });

var page = mongoose.model("corPage", schema);

page.savePage= function (p, fn) {
    var conditions, values, options;
    conditions = {path: p.path};
    options = {upsert: true};
    values = p;

    page.findOneAndUpdate(conditions, values, options).exec(fn);
}

page.getAll = function(fn) {
    page.find({}).exec(fn);
}