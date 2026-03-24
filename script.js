(function () {
    "use strict";

    function init() {
        if (typeof window.getRawScreenArea !== "function") {
            throw new Error("getRawScreenArea function not found.");
        }

        if (typeof window.collectScreenArea !== "function") {
            throw new Error("collectScreenArea function not found.");
        }

        var rawArea = window.getRawScreenArea();
        var rawAreaElement = document.getElementById("raw-area");
        if (rawAreaElement) {
            rawAreaElement.textContent = "Raw area: " + rawArea.toLocaleString() + " px";
        }

        console.log("Raw screen area (px):", rawArea);
        window.collectScreenArea();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
