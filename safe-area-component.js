(function() {
    'use strict';

    const viewportMeta = document.querySelector('meta[name="viewport"]');

    function getModeFromUrl() {
        const url = new URL(window.location.href);
        return url.searchParams.get('fit') === 'auto' ? 'auto' : 'cover';
    }

    function setViewportMeta(mode) {
        if (!viewportMeta) {
            return;
        }

        const content = mode === 'cover'
            ? 'width=device-width, initial-scale=1.0, viewport-fit=cover'
            : 'width=device-width, initial-scale=1.0';

        viewportMeta.setAttribute('content', content);
    }

    function setModeAndReload(nextMode) {
        const url = new URL(window.location.href);
        if (nextMode === 'cover') {
            url.searchParams.delete('fit');
        } else {
            url.searchParams.set('fit', 'auto');
        }
        window.location.href = url.toString();
    }

    function readSafeAreaInsets() {
        const parsePx = (value) => {
            const parsed = parseFloat(value);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        const normalizeInsets = (raw) => {
            const insets = raw || {};
            return {
                top: parsePx(insets.top),
                right: parsePx(insets.right),
                bottom: parsePx(insets.bottom),
                left: parsePx(insets.left)
            };
        };

        const hasPositiveInset = (insets) => (
            insets.top > 0 || insets.right > 0 || insets.bottom > 0 || insets.left > 0
        );

        const rootStyles = getComputedStyle(document.documentElement);
        const cssInsets = normalizeInsets({
            top: rootStyles.getPropertyValue('--safe-area-top'),
            right: rootStyles.getPropertyValue('--safe-area-right'),
            bottom: rootStyles.getPropertyValue('--safe-area-bottom'),
            left: rootStyles.getPropertyValue('--safe-area-left')
        });

        if (hasPositiveInset(cssInsets)) {
            return cssInsets;
        }

        const probe = document.createElement('div');
        probe.style.position = 'fixed';
        probe.style.visibility = 'hidden';
        probe.style.pointerEvents = 'none';
        probe.style.inset = '0';
        probe.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        probe.style.paddingRight = 'env(safe-area-inset-right, 0px)';
        probe.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
        probe.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
        document.body.appendChild(probe);

        const computed = getComputedStyle(probe);
        const insets = normalizeInsets({
            top: computed.paddingTop,
            right: computed.paddingRight,
            bottom: computed.paddingBottom,
            left: computed.paddingLeft
        });

        document.body.removeChild(probe);
        return insets;
    }

    function computeSafeRect(insets) {
        return {
            x: insets.left,
            y: insets.top,
            width: Math.max(0, window.innerWidth - insets.left - insets.right),
            height: Math.max(0, window.innerHeight - insets.top - insets.bottom)
        };
    }

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

    function getRuntimeInfo(insets) {
        const orientation = typeof window.detectOrientation === 'function'
            ? window.detectOrientation()
            : 'square';
        const safeInsets = insets || readSafeAreaInsets();

        return {
            deviceModel: detectDeviceModel(),
            browserInfo: typeof window.detectBrowserInfo === 'function'
                ? window.detectBrowserInfo()
                : 'Unknown',
            maxScreenArea: getMaximumScreenArea(),
            orientation,
            notchPosition: getNotchPosition(safeInsets, orientation)
        };
    }

    function getState() {
        const mode = getModeFromUrl();
        const insets = readSafeAreaInsets();
        return {
            mode,
            caseLabel: mode === 'cover'
                ? 'Case 2: App-managed (viewport-fit=cover + safe insets)'
                : 'Case 1: Browser-managed (viewport-fit=auto/default)',
            insets,
            safeRect: computeSafeRect(insets),
            orientation: typeof window.detectOrientation === 'function'
                ? window.detectOrientation()
                : 'square',
            screen: {
                width: window.screen.width,
                height: window.screen.height
            },
            window: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            dpr: window.devicePixelRatio || 1
        };
    }

    function createSafeAreaComponent() {
        const subscribers = new Set();

        function notify() {
            const state = getState();
            subscribers.forEach((callback) => callback(state));
            return state;
        }

        function onChange(callback) {
            subscribers.add(callback);
            callback(getState());
            return function unsubscribe() {
                subscribers.delete(callback);
            };
        }

        function applyPadding(element, options) {
            const opts = options || {};
            const extra = opts.extra || {};
            const state = getState();
            element.style.paddingTop = `${state.insets.top + (extra.top || 0)}px`;
            element.style.paddingRight = `${state.insets.right + (extra.right || 0)}px`;
            element.style.paddingBottom = `${state.insets.bottom + (extra.bottom || 0)}px`;
            element.style.paddingLeft = `${state.insets.left + (extra.left || 0)}px`;
            return state;
        }

        function setMode(mode) {
            const normalized = mode === 'auto' ? 'auto' : 'cover';
            setModeAndReload(normalized);
        }

        function init() {
            setViewportMeta(getModeFromUrl());
        }

        return {
            init,
            getState,
            getRuntimeInfo,
            onChange,
            notify,
            applyPadding,
            setMode
        };
    }

    window.SafeAreaComponent = createSafeAreaComponent();
})();
