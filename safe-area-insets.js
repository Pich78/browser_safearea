(function () {
    "use strict";

    function toPxNumber(value) {
        var parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    // Returns safe-area inset values exposed through CSS env() variables.
    function getSafeAreaInsets() {
        var computed = window.getComputedStyle(document.documentElement);

        return {
            top: toPxNumber(computed.getPropertyValue("--safe-area-top")),
            right: toPxNumber(computed.getPropertyValue("--safe-area-right")),
            bottom: toPxNumber(computed.getPropertyValue("--safe-area-bottom")),
            left: toPxNumber(computed.getPropertyValue("--safe-area-left"))
        };
    }

    window.getSafeAreaInsets = getSafeAreaInsets;
})();
