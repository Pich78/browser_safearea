(function() {
    'use strict';

    function detectOrientation() {
        return window.matchMedia('(orientation: portrait)').matches
            ? 'portrait'
            : window.matchMedia('(orientation: landscape)').matches
                ? 'landscape'
                : 'square';
    }

    window.detectOrientation = detectOrientation;
})();
