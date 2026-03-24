(function () {
    "use strict";

    // Returns the viewport size available for page content rendering.
    function getWindowInnerSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    window.getWindowInnerSize = getWindowInnerSize;
})();