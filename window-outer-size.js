(function () {
    "use strict";

    // Returns the full browser window size including browser chrome when available.
    function getWindowOuterSize() {
        return {
            width: window.outerWidth,
            height: window.outerHeight
        };
    }

    window.getWindowOuterSize = getWindowOuterSize;
})();