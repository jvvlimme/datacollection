/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , fs = require('fs')
    , buffer = require('buffer').Buffer
    , conf = require("./configs/config.global")
    , mongoose = require("mongoose")
    , mongodb = mongoose.connect(conf.mongo.url, function(err) { })
    , corUser = require("./models/corUser")
    , corPage = require("./models/corPage")
    , corUserMetrics = require("./models/corUserMetrics")
    , corUserTechnical = require("./models/corUserTechnical")
    , corVisitMetrics = require("./models/corVisitMetrics")
    , user = mongoose.model("corUser")
    , page = mongoose.model("corPage")
    , userMetrics = mongoose.model("corUserMetrics")
    , userTechnical = mongoose.model("corUserTechnical")
    , visitMetrics = mongoose.model("corVisitMetrics")
    , path = require('path')
    , ua = require("ua-parser")
    , async = require("async")
    , moment = require("moment")
    , jf = require("jsonfile");

var app = express();

var mongoarray = [], uTech= [];

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

var visits2file = function (i, res) {
    console.log(i);
    visitMetrics.find({date: {$gte: moment.utc("2013-08-30 12:00").startOf("hour").format(), $lte: moment.utc("2013-08-30 12:00").endOf("hour").format()}})
        .limit(1000)
        .skip(i * 1000)
        .populate("user")
        .populate("page")
        .exec(function (err, r) {
            if(r.length) {

                if (err) console.log(err);
                mongoarray.push(r);
                i++;

                var j = 0, l = r.length;
                for (j; j<l; j++) {
                    uTech.push(r[j].user[0]._id);
                }

                visits2file(i);


            } else {
                /*fs.writeFileSync("/home/node/tmp/"+ "userMetrics" + ".json", mongoarray, 'utf8', function (err, r) {
                });*/

                var tech = uTech.getUnique(), k = 0, technicalDetails = [];

                function addTech(id) {
                    console.log(id);
                    if (tech.length >0) {
                    userTechnical.find({user:id}).exec(function(err, r) {
                        if(err) throw new Error(err);
                        if (r.length > 0) technicalDetails.push(r);
                        addTech(tech.pop())
                    });
                    } else {
                        console.log(technicalDetails);
                        fs.writeFileSync("/home/node/tmp/"+ "userTechnical" + ".json", technicalDetails, 'utf8', function (err, r) {
                            callback(err,r);
                        });
                    }
                }
                addTech(tech.pop());

            }
        });
}

// all environments
app.set('port', process.env.PORT || 3000);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get("/pages", function(req, res) {
    visitMetrics.count({
        date: {$gte: moment.utc("2013-08-30").startOf("day").format(), $lte: moment.utc("2013-08-30").endOf("day").format()}
    }, function(err, count) {

        visits2file(0, res);

    });
});

app.get('/i.gif', function (req, res) {

/*
    var e = JSON.parse(req.query.a);
    e.useragent = ua.parseUA(req.headers['user-agent']).toString();
    e.os = ua.parseOS(req.headers['user-agent']).toString();
    e.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

    // Prepare user object

    var u = e.user;
    u.uuid = e.uuid;
    u.language = e.language;
    u.brand = e.config.page_papercode;

    // Prepare page object

    var p = e.config;
    p.path = e.url;

    async.parallel([function(cb){
        user.saveUser(u, cb);
    }, function(cb){
        page.savePage(p, cb);
    }], function(err, r) {
        if (err) {
            console.log("Error getting ID");

        }
        if (typeof r[0] == "undefined" || typeof r[1] == "undefined") {
            console.log("Unable to retrieve id");

        }
        if (!err) {
            var userId = r[0]._id, pageId = r[1]._id;

            // Prepare corVisitMetrics
            var cvm = {}
            cvm.user = userId;
            cvm.page = pageId;
            cvm.referrer = e.referrer;

            // Prepare corUserMetrics

            // This only needs the userId

            // Prepare corUserTechnical

            var cut = {}
            cut.user = userId;
            cut.resolution = e.resolution;
            cut.language = e.language;
            cut.browser = e.useragent;
            cut.os = e.os;
            cut.ip = e.ip;

            async.parallel([
                function(cb) {
                    visitMetrics.saveMetrics(cvm, cb);
                },
                function(cb) {
                    userMetrics.saveMetrics(userId, cb);
                },
                function(cb) {
                    userTechnical.saveTechnical(cut, cb);
                }
            ], function(err, r){
                (err) ? console.log(err): true;
            });


        }

    });

*/
    res.set({
        'Content-Length': 42,
        'Content-Type': "image/gif",
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "X-Requested-With",
        'Cache-Control': "no-store, no-cache, must-revalidate, max-age=0,post-check=0,pre-check=0"
    });

    res.send(new buffer("GIF89a\u0001\u0000\u0001\u0000\u0000\u0000\u0000\u0000\u0000ÿÿÿ!ù\u0004\u0001\u0000\u0000\u0000\u0000,\u0000\u0000\u0000\u0000\u0001\u0000\u0001\u0000\u0000\u0002\u0001D\u0000;", 'binary'));
});



http.createServer(app).listen(app.get('port'), function () {
    console.log('Here comes the boom!');
});
