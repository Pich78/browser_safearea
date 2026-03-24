(function () {
    "use strict";

    function getRawScreenArea() {
        var width = window.screen.width;
        var height = window.screen.height;

        return {
            width: width,
            height: height,
            area: width * height
        };
    }

    window.getRawScreenArea = getRawScreenArea;
})();
