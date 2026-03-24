(function () {
    "use strict";

    function collectScreenArea() {
        var width = window.screen.width;
        var height = window.screen.height;

        var sizeElement = document.getElementById("screen-size");
        if (sizeElement) {
            sizeElement.textContent = "Screen size: " + width + " x " + height + " px";
        }

        return {
            width: width,
            height: height
        };
    }

    window.collectScreenArea = collectScreenArea;
})();