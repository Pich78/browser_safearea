(function() {
    'use strict';

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const url = new URL(window.location.href);
    const fitParam = url.searchParams.get('fit');
    const mode = fitParam === 'auto' ? 'auto' : 'cover';

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
        screenSize: document.getElementById('screenSize'),
        windowSize: document.getElementById('windowSize'),
        dpr: document.getElementById('dpr'),
        toggleBtn: document.getElementById('toggleBtn')
    };

    function setViewportMeta(selectedMode) {
        const content = selectedMode === 'cover'
            ? 'width=device-width, initial-scale=1.0, viewport-fit=cover'
            : 'width=device-width, initial-scale=1.0';

        viewportMeta.setAttribute('content', content);
    }

    function setModeAndReload(nextMode) {
        const nextUrl = new URL(window.location.href);
        if (nextMode === 'cover') {
            nextUrl.searchParams.delete('fit');
        } else {
            nextUrl.searchParams.set('fit', 'auto');
        }
        window.location.href = nextUrl.toString();
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

    function computeSafeRect(insets) {
        return {
            x: insets.left,
            y: insets.top,
            width: Math.max(0, window.innerWidth - insets.left - insets.right),
            height: Math.max(0, window.innerHeight - insets.top - insets.bottom)
        };
    }

    function getOrientation() {
        return window.matchMedia('(orientation: portrait)').matches
            ? 'portrait'
            : window.matchMedia('(orientation: landscape)').matches
                ? 'landscape'
                : 'square';
    }

    function getCurrentState() {
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
            const state = getCurrentState();
            subscribers.forEach((callback) => callback(state));
            return state;
        }

        function onChange(callback) {
            subscribers.add(callback);
            callback(getCurrentState());
            return function unsubscribe() {
                subscribers.delete(callback);
            };
        }

        function applyPadding(element, options) {
            const opts = options || {};
            const extra = opts.extra || {};
            const state = getCurrentState();
            element.style.paddingTop = `${state.insets.top + (extra.top || 0)}px`;
            element.style.paddingRight = `${state.insets.right + (extra.right || 0)}px`;
            element.style.paddingBottom = `${state.insets.bottom + (extra.bottom || 0)}px`;
            element.style.paddingLeft = `${state.insets.left + (extra.left || 0)}px`;
            return state;
        }

        function setMode(nextMode) {
            const normalized = nextMode === 'auto' ? 'auto' : 'cover';
            setModeAndReload(normalized);
        }

        return {
            getState: getCurrentState,
            onChange,
            notify,
            applyPadding,
            setMode
        };
    }

    const SafeAreaComponent = createSafeAreaComponent();
    window.SafeAreaComponent = SafeAreaComponent;

    function getDeviceInfo() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const availWidth = window.screen.availWidth;
        const availHeight = window.screen.availHeight;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        let device = 'Unknown';
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            if (/iPad/.test(userAgent)) {
                device = 'iPad';
            } else if (/iPhone/.test(userAgent)) {
                if (userAgent.includes('iPhone 14 Pro')) {
                    device = 'iPhone 14 Pro';
                } else if (userAgent.includes('iPhone 14')) {
                    device = 'iPhone 14';
                } else if (userAgent.includes('iPhone 13')) {
                    device = 'iPhone 13';
                } else if (userAgent.includes('iPhone 12')) {
                    device = 'iPhone 12';
                } else if (userAgent.includes('iPhone 11')) {
                    device = 'iPhone 11';
                } else if (userAgent.includes('SE')) {
                    device = 'iPhone SE';
                } else {
                    device = 'iPhone';
                }
            }
        } else if (/Android/.test(userAgent)) {
            device = 'Android';
            if (/Mobile/.test(userAgent)) {
                device = 'Android Phone';
            } else {
                device = 'Android Tablet';
            }
        } else if (/Windows Phone/.test(userAgent)) {
            device = 'Windows Phone';
        } else if (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1) {
            device = 'iPad (Desktop Mode)';
        } else if (!/Mobi|Tablet|iPad|iPhone|iPod/.test(userAgent)) {
            device = 'Desktop';
        }

        elements.deviceType.textContent = device;
        elements.screenSize.textContent = `${screenWidth}x${screenHeight}`;
        elements.windowSize.textContent = `${innerWidth}x${innerHeight}`;
        elements.dpr.textContent = dpr;

        return {
            device,
            screenWidth,
            screenHeight,
            availWidth,
            availHeight,
            innerWidth,
            innerHeight,
            devicePixelRatio: dpr
        };
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
        elements.orientation.textContent = state.orientation;

        return state;
    }

    function toggleCase() {
        const nextMode = mode === 'cover' ? 'auto' : 'cover';
        SafeAreaComponent.setMode(nextMode);
    }

    function init() {
        setViewportMeta(mode);
        renderStatus();
        getDeviceInfo();

        elements.toggleBtn.addEventListener('click', toggleCase);

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                renderStatus();
                getDeviceInfo();
                SafeAreaComponent.notify();
            }, 100);
        });

        window.addEventListener('resize', () => {
            renderStatus();
            getDeviceInfo();
            SafeAreaComponent.notify();
        });

        const mediaQuery = window.matchMedia('(orientation: landscape)');
        mediaQuery.addEventListener('change', () => {
            renderStatus();
            getDeviceInfo();
            SafeAreaComponent.notify();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
