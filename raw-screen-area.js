(function () {
    "use strict";

    function getRawScreenArea() {
        return window.screen.width * window.screen.height;
    }

    window.getRawScreenArea = getRawScreenArea;
})();
