(function() {
    'use strict';

    const SafeAreaComponent = window.SafeAreaComponent;

    if (!SafeAreaComponent) {
        throw new Error('SafeAreaComponent not found. Ensure safe-area-component.js is loaded first.');
    }

    const elements = {
        statusMain: document.getElementById('statusMain'),
        modeCase: document.getElementById('modeCase'),
        safeRect: document.getElementById('safeRect'),
        insetTop: document.getElementById('insetTop'),
        insetRight: document.getElementById('insetRight'),
        insetBottom: document.getElementById('insetBottom'),
        insetLeft: document.getElementById('insetLeft'),
        orientation: document.getElementById('orientation'),
        deviceType: document.getElementById('deviceType'),
        browserInfo: document.getElementById('browserInfo'),
        maxScreenArea: document.getElementById('maxScreenArea'),
        notchPosition: document.getElementById('notchPosition'),
        screenSize: document.getElementById('screenSize'),
        windowSize: document.getElementById('windowSize'),
        dpr: document.getElementById('dpr'),
        toggleBtn: document.getElementById('toggleBtn')
    };

    function detectDeviceModel() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPhone|iPad|iPod/.test(userAgent) && !window.MSStream) {
            return /iPad/.test(userAgent) ? 'iPad' : 'iPhone';
        }
        if (/SamsungBrowser|SM-|GT-|Samsung/i.test(userAgent)) {
            return 'Samsung';
        }
        if (/Android/.test(userAgent)) {
            if (/Pixel/i.test(userAgent)) {
                return 'Google Pixel';
            }
            if (/OnePlus/i.test(userAgent)) {
                return 'OnePlus';
            }
            if (/HUAWEI|HONOR/i.test(userAgent)) {
                return 'Huawei';
            }
            if (/Xiaomi|Redmi|Mi\s/i.test(userAgent)) {
                return 'Xiaomi';
            }
            return 'Android';
        }
        if (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1) {
            return 'iPad (Desktop Mode)';
        }
        if (/Windows Phone/.test(userAgent)) {
            return 'Windows Phone';
        }
        if (!/Mobi|Tablet|iPad|iPhone|iPod/.test(userAgent)) {
            return 'Desktop';
        }
        return 'Unknown';
    }

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

    function getMaximumScreenArea() {
        const dpr = window.devicePixelRatio || 1;
        const widthPx = Math.round(window.screen.width * dpr);
        const heightPx = Math.round(window.screen.height * dpr);
        const pixelCount = widthPx * heightPx;
        return {
            widthPx,
            heightPx,
            pixelCount
        };
    }

    function getCurrentOrientation() {
        return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
    }

    function getNotchPosition(insets, orientation) {
        const edges = [
            { edge: 'top', value: insets.top },
            { edge: 'right', value: insets.right },
            { edge: 'bottom', value: insets.bottom },
            { edge: 'left', value: insets.left }
        ];
        edges.sort((a, b) => b.value - a.value);

        const strongest = edges[0];
        if (!strongest || strongest.value <= 0) {
            return 'none';
        }

        if (orientation === 'portrait') {
            if (strongest.edge === 'top') return 'up';
            if (strongest.edge === 'bottom') return 'down';
            if (strongest.edge === 'left') return 'left';
            return 'right';
        }

        if (strongest.edge === 'left') return 'left';
        if (strongest.edge === 'right') return 'right';
        if (strongest.edge === 'top') return 'up';
        return 'down';
    }

    function renderRuntimeInfo(state) {
        const device = detectDeviceModel();
        const browser = detectBrowserInfo();
        const orientation = getCurrentOrientation();
        const notchPosition = getNotchPosition(state.insets, orientation);
        const maxArea = getMaximumScreenArea();
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        elements.deviceType.textContent = device;
        elements.browserInfo.textContent = browser;
        elements.maxScreenArea.textContent = `${maxArea.widthPx}x${maxArea.heightPx} (${maxArea.pixelCount.toLocaleString()} px)`;
        elements.orientation.textContent = orientation;
        elements.notchPosition.textContent = notchPosition;
        elements.screenSize.textContent = `${screenWidth}x${screenHeight}`;
        elements.windowSize.textContent = `${innerWidth}x${innerHeight}`;
        elements.dpr.textContent = dpr;
    }

    function renderStatus() {
        const state = SafeAreaComponent.getState();
        elements.statusMain.textContent = `Status: viewport-fit=${state.mode === 'cover' ? 'cover' : 'auto'}`;
        elements.modeCase.textContent = state.caseLabel;
        elements.safeRect.textContent = `${Math.round(state.safeRect.width)}x${Math.round(state.safeRect.height)} @ (${Math.round(state.safeRect.x)}, ${Math.round(state.safeRect.y)})`;
        elements.insetTop.textContent = Math.round(state.insets.top);
        elements.insetRight.textContent = Math.round(state.insets.right);
        elements.insetBottom.textContent = Math.round(state.insets.bottom);
        elements.insetLeft.textContent = Math.round(state.insets.left);

        return state;
    }

    function refreshView() {
        const state = renderStatus();
        renderRuntimeInfo(state);
        SafeAreaComponent.notify();
    }

    function toggleCase() {
        const state = SafeAreaComponent.getState();
        const nextMode = state.mode === 'cover' ? 'auto' : 'cover';
        SafeAreaComponent.setMode(nextMode);
    }

    function init() {
        SafeAreaComponent.init();
        refreshView();

        elements.toggleBtn.addEventListener('click', toggleCase);

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                refreshView();
            }, 100);
        });

        window.addEventListener('resize', () => {
            refreshView();
        });

        const mediaQuery = window.matchMedia('(orientation: landscape)');
        mediaQuery.addEventListener('change', () => {
            refreshView();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
