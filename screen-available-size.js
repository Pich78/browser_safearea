(function () {
    "use strict";

    // Returns the available screen size after OS UI reservations such as taskbars/docks.
    function getScreenAvailableSize() {
        return {
            width: window.screen.availWidth,
            height: window.screen.availHeight
        };
    }

    window.getScreenAvailableSize = getScreenAvailableSize;
})();