require(['config', 'modules/user', 'modules/cookie'], function(config, user, cookie) {
    try { window.JSON } catch(e) { throw new Error(e) }

        var bcn = bcn || {}

        bcn.action = "load";

        if (!(bcn.uuid = cookie.get(bcn))) {
            bcn.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
            cookie.set("bcn", bcn.uuid, 365);
        }

        var w = window;

        bcn.viewporth = w.innerHeight || document.documentElement.offsetHeight;
        bcn.viewportw = w.innerWidth || document.documentElement.offsetWidth;

        bcn.title = document.title;
        bcn.url = w.location.origin + w.location.pathname;
        bcn.hostname = w.location.hostname;
        bcn.referrer = document.referrer;
        bcn.user = user;
        bcn.config = config;

        bcn.chrset = document.defaultCharset;
        bcn.colorDepth = screen.colorDepth;
        bcn.resolution = screen.width + "x" + screen.height;
        bcn.language = navigator.language || navigator.userLanguage;


       var img = document.createElement('img');
       img.src = "http://ctrack.jit.su/i.gif?a="+encodeURIComponent(JSON.stringify(bcn));


});
