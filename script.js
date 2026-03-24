(function () {
    "use strict";

    function init() {
        if (typeof window.getScreenSize !== "function") {
            throw new Error("getScreenSize function not found.");
        }

        if (typeof window.getScreenAvailableSize !== "function") {
            throw new Error("getScreenAvailableSize function not found.");
        }

        if (typeof window.getWindowOuterSize !== "function") {
            throw new Error("getWindowOuterSize function not found.");
        }

        if (typeof window.getWindowInnerSize !== "function") {
            throw new Error("getWindowInnerSize function not found.");
        }

        var screenMetrics = window.getScreenSize();
        var availableMetrics = window.getScreenAvailableSize();
        var outerMetrics = window.getWindowOuterSize();
        var innerMetrics = window.getWindowInnerSize();

        var rawOutline = document.getElementById("raw-outline");
        if (rawOutline) {
            rawOutline.style.width = screenMetrics.width + "px";
            rawOutline.style.height = screenMetrics.height + "px";
        }

        var screenElement = document.getElementById("measure-screen");
        if (screenElement) {
            screenElement.textContent = "window.screen.width / window.screen.height: " + screenMetrics.width + " x " + screenMetrics.height + " px";
        }

        var availElement = document.getElementById("measure-avail");
        if (availElement) {
            availElement.textContent = "window.screen.availWidth / window.screen.availHeight: " + availableMetrics.width + " x " + availableMetrics.height + " px";
        }

        var outerElement = document.getElementById("measure-outer");
        if (outerElement) {
            outerElement.textContent = "window.outerWidth / window.outerHeight: " + outerMetrics.width + " x " + outerMetrics.height + " px";
        }

        var innerElement = document.getElementById("measure-inner");
        if (innerElement) {
            innerElement.textContent = "window.innerWidth / window.innerHeight: " + innerMetrics.width + " x " + innerMetrics.height + " px";
        }

        console.log("Screen size:", screenMetrics);
        console.log("Available screen size:", availableMetrics);
        console.log("Outer window size:", outerMetrics);
        console.log("Inner window size:", innerMetrics);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
