(function () {
    "use strict";

    // Returns the full physical screen size exposed by the browser in CSS pixels.
    function getScreenSize() {
        return {
            width: window.screen.width,
            height: window.screen.height
        };
    }

    window.getScreenSize = getScreenSize;
})();