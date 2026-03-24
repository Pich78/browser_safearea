(function () {
    "use strict";

    function collectScreenArea() {
        var width = window.screen.width;
        var height = window.screen.height;
        var area = width * height;

        document.body.style.margin = "0";
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.minHeight = "100vh";

        var sizeElement = document.getElementById("screen-size");
        if (sizeElement) {
            sizeElement.textContent = "Screen size: " + width + " x " + height + " px";
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