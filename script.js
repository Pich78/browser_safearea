(function () {
    "use strict";

    function init() {
        if (typeof window.getRawScreenArea !== "function") {
            throw new Error("getRawScreenArea function not found.");
        }

        if (typeof window.collectScreenArea !== "function") {
            throw new Error("collectScreenArea function not found.");
        }

        var rawMetrics = window.getRawScreenArea();

        var rawOutline = document.getElementById("raw-outline");
        if (rawOutline) {
            rawOutline.style.width = rawMetrics.width + "px";
            rawOutline.style.height = rawMetrics.height + "px";
        }

        var rawAreaElement = document.getElementById("raw-area");
        if (rawAreaElement) {
            rawAreaElement.textContent = "Raw area: " + rawMetrics.area.toLocaleString() + " px (" + rawMetrics.width + " x " + rawMetrics.height + " px)";
        }

        console.log("Raw screen metrics:", rawMetrics);
        window.collectScreenArea();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
