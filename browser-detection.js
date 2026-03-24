(function() {
    'use strict';

    function detectBrowserInfo() {
        const ua = navigator.userAgent;
        let match;

        match = ua.match(/Edg\/(\d+(?:\.\d+)?)/);
        if (match) return `Edge ${match[1]}`;

        match = ua.match(/OPR\/(\d+(?:\.\d+)?)/);
        if (match) return `Opera ${match[1]}`;

        match = ua.match(/SamsungBrowser\/(\d+(?:\.\d+)?)/);
        if (match) return `Samsung Internet ${match[1]}`;

        match = ua.match(/Chrome\/(\d+(?:\.\d+)?)/);
        if (match && !/Edg\//.test(ua) && !/OPR\//.test(ua)) return `Chrome ${match[1]}`;

        match = ua.match(/Version\/(\d+(?:\.\d+)?).*Safari/);
        if (match && !/Chrome|Chromium|CriOS/.test(ua)) return `Safari ${match[1]}`;

        match = ua.match(/Firefox\/(\d+(?:\.\d+)?)/);
        if (match) return `Firefox ${match[1]}`;

        return 'Unknown';
    }

    window.detectBrowserInfo = detectBrowserInfo;
})();
