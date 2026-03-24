(function () {
    "use strict";

    function collectScreenArea() {
        var width = window.screen.width;
        var height = window.screen.height;
        var area = typeof window.getRawScreenArea === "function"
            ? window.getRawScreenArea()
            : width * height;

        document.body.style.margin = "0";
        document.body.style.backgroundColor = "#1a1a1a";
        document.body.style.minHeight = "100vh";
        document.body.style.display = "grid";
        document.body.style.placeItems = "center";

        var mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.style.fontFamily = "Arial, sans-serif";
            mainElement.style.textAlign = "center";
        }

        var rawAreaElement = document.getElementById("raw-area");
        if (rawAreaElement) {
            rawAreaElement.textContent = "Raw area: " + area.toLocaleString() + " px";
            rawAreaElement.style.color = "#ffffff";
        }

        var sizeElement = document.getElementById("screen-size");
        if (sizeElement) {
            sizeElement.textContent = "Screen size: " + width + " x " + height + " px";
            sizeElement.style.color = "#90ee90";
        }

        console.log("Screen area (px):", area);

        return {
            width: width,
            height: height,
            area: area
        };
    }

    window.collectScreenArea = collectScreenArea;
})();