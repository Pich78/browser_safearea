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
        const insets = {
            top: parseFloat(computed.paddingTop) || 0,
            right: parseFloat(computed.paddingRight) || 0,
            bottom: parseFloat(computed.paddingBottom) || 0,
            left: parseFloat(computed.paddingLeft) || 0
        };

        document.body.removeChild(probe);
        return insets;
    }

    function getOrientation() {
        return window.matchMedia('(orientation: portrait)').matches
            ? 'portrait'
            : window.matchMedia('(orientation: landscape)').matches
                ? 'landscape'
                : 'square';
    }

    function computeSafeRect(insets) {
        return {
            x: insets.left,
            y: insets.top,
            width: Math.max(0, window.innerWidth - insets.left - insets.right),
            height: Math.max(0, window.innerHeight - insets.top - insets.bottom)
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
            orientation: getOrientation(),
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
            onChange,
            notify,
            applyPadding,
            setMode
        };
    }

    window.SafeAreaComponent = createSafeAreaComponent();
})();
