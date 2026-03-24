(function () {
    "use strict";

    function init() {
        if (typeof window.collectScreenArea !== "function") {
            throw new Error("collectScreenArea function not found.");
        }

        window.collectScreenArea();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
