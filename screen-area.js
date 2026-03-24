(function () {
    "use strict";

    function collectScreenArea() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var sizeElement = document.getElementById("screen-size");
        if (sizeElement) {
            sizeElement.textContent = "Screen size (viewport): " + width + " x " + height + " px";
        }

        return {
            width: width,
            height: height
        };
    }

    window.collectScreenArea = collectScreenArea;
})();