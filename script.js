(function () {
    "use strict";

    var lastOrientation = null;

    function getOrientationLabel() {
        return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    }

    function renderOrientationEvent(source) {
        var currentOrientation = getOrientationLabel();
        var transition = lastOrientation
            ? lastOrientation + " -> " + currentOrientation
            : "initial -> " + currentOrientation;
        var message = "Orientation event (" + source + "): " + transition;

        var orientationEventElement = document.getElementById("measure-orientation-event");
        if (orientationEventElement) {
            orientationEventElement.textContent = message;
        }

        console.log(message);
        lastOrientation = currentOrientation;
    }

    function getMode() {
        var params = new URLSearchParams(window.location.search);
        return params.get("mode") === "cover" ? "cover" : "auto";
    }

    function setViewportMode(mode) {
        var viewportMeta = document.getElementById("viewportMeta");
        if (!viewportMeta) {
            return;
        }

        if (mode === "cover") {
            viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, viewport-fit=cover");
        } else {
            viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0");
        }
    }

    function updateModeUI(mode) {
        var modeState = document.getElementById("mode-state");
        if (modeState) {
            if (mode === "cover") {
                modeState.textContent = "Mode: viewport-fit=cover (safe-area padding active)";
            } else {
                modeState.textContent = "Mode: auto (safe-area symmetry)";
            }
        }

        var toggleButton = document.getElementById("toggle-mode");
        if (toggleButton) {
            toggleButton.textContent = mode === "cover"
                ? "Switch To auto"
                : "Switch To viewport-fit=cover";
        }
    }

    function setBodyModeClass(mode) {
        document.body.classList.toggle("mode-cover", mode === "cover");
    }

    function detectNotchSide(insets) {
        var maxInset = Math.max(insets.top, insets.right, insets.bottom, insets.left);
        if (maxInset <= 0) {
            return "none";
        }

        if (maxInset === insets.top) {
            return "top";
        }

        if (maxInset === insets.right) {
            return "right";
        }

        if (maxInset === insets.bottom) {
            return "bottom";
        }

        return "left";
    }

    function applyInnerOutline(innerMetrics, insets, mode) {
        var innerOutline = document.getElementById("inner-outline");
        if (!innerOutline) {
            return;
        }

        var width = innerMetrics.width;
        var height = innerMetrics.height;
        var left = 0;
        var top = 0;
        var isLandscape = innerMetrics.width > innerMetrics.height;

        if (mode === "cover" && isLandscape) {
            if (insets.left > insets.right) {
                width += insets.left - insets.right;
            } else if (insets.right > insets.left) {
                var extension = insets.right - insets.left;
                width += extension;
                left -= extension;
            }
        }

        innerOutline.style.left = left + "px";
        innerOutline.style.top = top + "px";
        innerOutline.style.width = width + "px";
        innerOutline.style.height = height + "px";
    }

    function toggleMode() {
        var currentMode = getMode();
        var nextMode = currentMode === "cover" ? "auto" : "cover";
        var url = new URL(window.location.href);
        url.searchParams.set("mode", nextMode);

        // Reload with explicit mode for more stable mobile behavior.
        window.location.href = url.toString();
    }

    function renderMetrics() {
        if (typeof window.getScreenSize !== "function") {
            throw new Error("getScreenSize function not found.");
        }

        if (typeof window.getScreenAvailableSize !== "function") {
            throw new Error("getScreenAvailableSize function not found.");
        }

        if (typeof window.getWindowOuterSize !== "function") {
            throw new Error("getWindowOuterSize function not found.");
        }

        if (typeof window.getWindowInnerSize !== "function") {
            throw new Error("getWindowInnerSize function not found.");
        }

        if (typeof window.getSafeAreaInsets !== "function") {
            throw new Error("getSafeAreaInsets function not found.");
        }

        var mode = getMode();
        setViewportMode(mode);
        setBodyModeClass(mode);
        updateModeUI(mode);

        var screenMetrics = window.getScreenSize();
        var availableMetrics = window.getScreenAvailableSize();
        var outerMetrics = window.getWindowOuterSize();
        var innerMetrics = window.getWindowInnerSize();
        var insets = window.getSafeAreaInsets();
        var notchSide = detectNotchSide(insets);

        applyInnerOutline(innerMetrics, insets, mode);

        var screenElement = document.getElementById("measure-screen");
        if (screenElement) {
            screenElement.textContent = "window.screen.width / window.screen.height: " + screenMetrics.width + " x " + screenMetrics.height + " px";
        }

        var availElement = document.getElementById("measure-avail");
        if (availElement) {
            availElement.textContent = "window.screen.availWidth / window.screen.availHeight: " + availableMetrics.width + " x " + availableMetrics.height + " px";
        }

        var outerElement = document.getElementById("measure-outer");
        if (outerElement) {
            outerElement.textContent = "window.outerWidth / window.outerHeight: " + outerMetrics.width + " x " + outerMetrics.height + " px";
        }

        var notchElement = document.getElementById("measure-notch");
        if (notchElement) {
            notchElement.textContent = "Notch side: " + notchSide + " (insets t/r/b/l: " + insets.top + "/" + insets.right + "/" + insets.bottom + "/" + insets.left + " px)";
        }

        var innerElement = document.getElementById("measure-inner");
        if (innerElement) {
            innerElement.textContent = "window.innerWidth / window.innerHeight: " + innerMetrics.width + " x " + innerMetrics.height + " px";
        }

        console.log("Safe-area insets:", insets);
        console.log("Screen size:", screenMetrics);
        console.log("Available screen size:", availableMetrics);
        console.log("Outer window size:", outerMetrics);
        console.log("Inner window size:", innerMetrics);
    }

    function init() {
        renderOrientationEvent("init");
        renderMetrics();
        window.addEventListener("resize", renderMetrics);

        window.addEventListener("orientationchange", function () {
            setTimeout(function () {
                renderOrientationEvent("orientationchange");
                renderMetrics();
            }, 120);
        });

        var orientationMediaQuery = window.matchMedia("(orientation: landscape)");
        orientationMediaQuery.addEventListener("change", function () {
            renderOrientationEvent("media-query");
            renderMetrics();
        });

        var toggleButton = document.getElementById("toggle-mode");
        if (toggleButton) {
            toggleButton.addEventListener("click", toggleMode);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
