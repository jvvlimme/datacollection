;(function() {

    completed = function( event ) {

        // readyState === "complete" is good enough for us to call the dom ready in oldIE
        if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {

            detach();
            var bcn = bcn || {}

            bcn.action = "load";

            var w = window;
            var p = w.performance || w.msPerformance || w.webkitPerformance || w.mozPerformance;
            bcn.loadtime = p.timing.loadEventEnd-p.timing.navigationStart;
            if (!document.cookie.match(/bcn=1/)) {
                bcn.viewporth = w.innerHeight || document.documentElement.offsetHeight;
                bcn.viewportw = w.innerWidth || document.documentElement.offsetWidth;
                bcn.action = "session";
            }

            bcn.title = document.title;
            bcn.url = w.location.href;
            bcn.hostname = w.location.hostname;
            bcn.referrer = document.referrer;

            if (typeof store.get("bcn") == "undefined") {
                bcn.user = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                store.set("bcn", bcn.user);
                bcn.chrset = document.defaultCharset;
                bcn.colorDepth = screen.colorDepth;
                bcn.resolution = screen.width + "x" + screen.height;
                bcn.language = navigator.language || navigator.userLanguage;
            } else {
                bcn.user = store.get("bcn");
            }
            var date = new Date();
            document.cookie = "bcn=1;path=/;"+"expires"+date.setTime(date.getTime()+(15*60*1000));
            console.log(bcn);
            var img = document.createElement('img');
            img.src = "http://track.bcn52.com/i.gif?a="+encodeURIComponent(JSON.stringify(bcn));
        }
    },
        // Clean-up method for dom ready events
        detach = function() {
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", completed, false );
                window.removeEventListener( "load", completed, false );

            } else {
                document.detachEvent( "onreadystatechange", completed );
                window.detachEvent( "onload", completed );
            }
        };

    completed();
})();/**
 * Created by jnvn01 on 14/08/13.
 */
