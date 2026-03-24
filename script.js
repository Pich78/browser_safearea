(function() {
    'use strict';

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    let isCoverMode = true;

    const elements = {
        statusMain: document.getElementById('statusMain'),
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

    function getOrientation() {
        const orientation = window.matchMedia('(orientation: portrait)').matches 
            ? 'portrait' 
            : window.matchMedia('(orientation: landscape)').matches 
                ? 'landscape' 
                : 'square';
        
        elements.orientation.textContent = orientation;
        return orientation;
    }

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

    function updateSafeAreaInsets() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        const top = computedStyle.getPropertyValue('safe-area-inset-top').trim();
        const right = computedStyle.getPropertyValue('safe-area-inset-right').trim();
        const bottom = computedStyle.getPropertyValue('safe-area-inset-bottom').trim();
        const left = computedStyle.getPropertyValue('safe-area-inset-left').trim();

        const topPx = top ? parseInt(top) : 0;
        const rightPx = right ? parseInt(right) : 0;
        const bottomPx = bottom ? parseInt(bottom) : 0;
        const leftPx = left ? parseInt(left) : 0;

        elements.insetTop.textContent = topPx;
        elements.insetRight.textContent = rightPx;
        elements.insetBottom.textContent = bottomPx;
        elements.insetLeft.textContent = leftPx;

        return { top: topPx, right: rightPx, bottom: bottomPx, left: leftPx };
    }

    function toggleViewportFit() {
        isCoverMode = !isCoverMode;
        
        const newContent = isCoverMode 
            ? 'width=device-width, initial-scale=1.0, viewport-fit=cover'
            : 'width=device-width, initial-scale=1.0';
        
        viewportMeta.setAttribute('content', newContent);
        elements.statusMain.textContent = `Status: viewport-fit=${isCoverMode ? 'cover' : 'auto'}`;
        
        setTimeout(() => {
            updateSafeAreaInsets();
            getDeviceInfo();
        }, 100);
    }

    function init() {
        updateSafeAreaInsets();
        getOrientation();
        getDeviceInfo();

        elements.toggleBtn.addEventListener('click', toggleViewportFit);

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                getOrientation();
                getDeviceInfo();
                updateSafeAreaInsets();
            }, 100);
        });

        window.addEventListener('resize', () => {
            getDeviceInfo();
            updateSafeAreaInsets();
        });

        const mediaQuery = window.matchMedia('(orientation: landscape)');
        mediaQuery.addEventListener('change', () => {
            getOrientation();
            getDeviceInfo();
            updateSafeAreaInsets();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
