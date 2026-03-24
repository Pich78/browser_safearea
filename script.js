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
        screenSize: document.getElementById('screenSize'),
        windowSize: document.getElementById('windowSize'),
        dpr: document.getElementById('dpr'),
        toggleBtn: document.getElementById('toggleBtn')
    };

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
        const state = SafeAreaComponent.getState();
        const nextMode = state.mode === 'cover' ? 'auto' : 'cover';
        SafeAreaComponent.setMode(nextMode);
    }

    function init() {
        SafeAreaComponent.init();
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
