/* Counts phone-button activation only; never cancels or delays the tel action. */
(function () {
    "use strict";
    if (window.A365TrackingDisabled === true) return;
    var endpoint = "https://www.odreai.com/api/visit";
    function send(payload) {
        try {
            fetch(endpoint, {method:"POST",headers:{"Content-Type":"application/json"},body:payload,
                keepalive:true,credentials:"omit"}).catch(function () {});
        } catch (ignore) {}
    }
    function eventId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
        return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 14);
    }
    function buttonId(link) {
        if (location.pathname === "/complete.html") return "complete";
        if (link.closest(".mbar")) return "mobile";
        if (link.closest(".float-nav")) return "floating";
        if (link.closest(".hero")) return "hero";
        if (link.closest(".process")) return "process";
        if (link.closest(".submit-alt")) return "submit-help";
        if (link.closest(".consult")) return "consult";
        if (link.closest("header")) return "header";
        return "other";
    }
    document.addEventListener("click", function (event) {
        if (event.isTrusted === false) return;
        var target = event.target instanceof Element ? event.target : event.target && event.target.parentElement;
        var link = target && target.closest('a[href^="tel:"]');
        if (!link) return;
        try {
            var snapshot = window.A365Tracker && window.A365Tracker.snapshot ? window.A365Tracker.snapshot() : {};
            var payload = JSON.stringify({eventType:"phone_click",eventId:eventId(),page:location.pathname,
                cta:buttonId(link),trafficSource:String(snapshot.trafficSource || "").slice(0,100)});
            send(payload);
        } catch (ignore) {}
    }, {capture:true,passive:true});
})();
