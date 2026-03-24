(function() {
    'use strict';

    const SafeAreaComponent = window.SafeAreaComponent;

    if (!SafeAreaComponent) {
        throw new Error('SafeAreaComponent not found. Ensure safe-area-runtime.js is loaded first.');
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

    let layoutPassToken = 0;

    function runWhenLayoutReady(callback) {
        const token = ++layoutPassToken;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (token !== layoutPassToken) {
                    return;
                }
                callback();
            });
        });
    }

    function renderRuntimeInfo(state) {
        const runtimeInfo = SafeAreaComponent.getRuntimeInfo(state.insets);
        const notchPosition = runtimeInfo.notchPosition || (
            typeof window.detectNotchPosition === 'function'
                ? window.detectNotchPosition(state.insets)
                : 'none'
        );
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        elements.deviceType.textContent = runtimeInfo.deviceModel;
        elements.browserInfo.textContent = runtimeInfo.browserInfo;
        elements.maxScreenArea.textContent = `${runtimeInfo.maxScreenArea.widthPx}x${runtimeInfo.maxScreenArea.heightPx} (${runtimeInfo.maxScreenArea.pixelCount.toLocaleString()} px)`;
        elements.orientation.textContent = runtimeInfo.orientation;
        elements.notchPosition.textContent = notchPosition;
        elements.screenSize.textContent = `${screenWidth}x${screenHeight}`;
        elements.windowSize.textContent = `${innerWidth}x${innerHeight}`;
        elements.dpr.textContent = dpr;

        console.log(`[SafeArea] Notch position: ${notchPosition}`, state.insets);
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
        runWhenLayoutReady(() => {
            renderRuntimeInfo(state);
            SafeAreaComponent.notify();
        });
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
