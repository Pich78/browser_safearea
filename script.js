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

    function startsWith(value, prefix) {
        return typeof value === "string" && value.indexOf(prefix) === 0;
    }

    function getNotchExtent(insets, notchLabel) {
        var fallbackExtent = 24;

        if (startsWith(notchLabel, "Left")) {
            return insets.left > 0 ? insets.left : fallbackExtent;
        }

        if (startsWith(notchLabel, "Right")) {
            return insets.right > 0 ? insets.right : fallbackExtent;
        }

        if (startsWith(notchLabel, "Top")) {
            return insets.top > 0 ? insets.top : fallbackExtent;
        }

        return 0;
    }

    function applyUsableAreaOutline(innerMetrics, insets, notchInfo, mode) {
        var innerOutline = document.getElementById("inner-outline");
        if (!innerOutline) {
            return;
        }

        var rect = {
            left: 0,
            top: 0,
            width: innerMetrics.width,
            height: innerMetrics.height
        };

        var notchLabel = notchInfo && notchInfo.notchPosition ? notchInfo.notchPosition : "";
        var notchExtent = getNotchExtent(insets, notchLabel);

        // In auto mode we keep symmetry: do not reclaim either side area.
        if (mode === "auto") {
            if ((startsWith(notchLabel, "Left") || startsWith(notchLabel, "Right")) && notchExtent > 0) {
                if (rect.width > notchExtent * 2) {
                    rect.left = notchExtent;
                    rect.width = rect.width - notchExtent * 2;
                }
            } else if (startsWith(notchLabel, "Top") && notchExtent > 0) {
                if (rect.height > notchExtent * 2) {
                    rect.top = notchExtent;
                    rect.height = rect.height - notchExtent * 2;
                }
            }
        }

        // In cover mode we exclude the notch side and reclaim the opposite side.
        if (mode === "cover") {
            if (startsWith(notchLabel, "Left") && notchExtent > 0) {
                rect.left = notchExtent;
                rect.width = Math.max(0, rect.width - notchExtent);
            } else if (startsWith(notchLabel, "Right") && notchExtent > 0) {
                rect.width = Math.max(0, rect.width - notchExtent);
            } else if (startsWith(notchLabel, "Top") && notchExtent > 0) {
                rect.top = notchExtent;
                rect.height = Math.max(0, rect.height - notchExtent);
            }
        }

        innerOutline.style.left = rect.left + "px";
        innerOutline.style.top = rect.top + "px";
        innerOutline.style.width = rect.width + "px";
        innerOutline.style.height = rect.height + "px";
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
        var notchInfo = null;

        if (typeof window.detectNotchPosition === "function") {
            notchInfo = window.detectNotchPosition();
        }

        applyUsableAreaOutline(innerMetrics, insets, notchInfo, mode);

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

        var innerElement = document.getElementById("measure-inner");
        if (innerElement) {
            innerElement.textContent = "window.innerWidth / window.innerHeight: " + innerMetrics.width + " x " + innerMetrics.height + " px";
        }

        if (typeof window.scheduleNotchDetection === "function") {
            window.scheduleNotchDetection();
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

        if (typeof window.scheduleNotchDetection === "function") {
            window.scheduleNotchDetection();
        } else if (typeof window.detectNotchPosition === "function") {
            window.setTimeout(window.detectNotchPosition, 80);
        }

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
