(function () {
    "use strict";

    var NOTCH_THRESHOLD = 20;
    var SIDE_DELTA_THRESHOLD = 2;

    function isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    function getOrientationAngle() {
        if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === "number") {
            return window.screen.orientation.angle;
        }

        if (typeof window.orientation === "number") {
            return window.orientation;
        }

        return null;
    }

    function getLandscapeSideFromAngle() {
        var angle = getOrientationAngle();
        if (angle === 90) {
            return "Left (landscape)";
        }

        if (angle === -90 || angle === 270) {
            return "Right (landscape)";
        }

        return null;
    }

    function classifyNotchSide(top, left, right) {
        if (isLandscape()) {
            var sideDiff = left - right;

            if ((left > NOTCH_THRESHOLD || right > NOTCH_THRESHOLD) && Math.abs(sideDiff) > SIDE_DELTA_THRESHOLD) {
                return sideDiff > 0 ? "Left (landscape)" : "Right (landscape)";
            }

            var sideByAngle = getLandscapeSideFromAngle();
            if (sideByAngle) {
                return sideByAngle + " (orientation)";
            }

            return "Landscape (side unavailable)";
        }

        if (top > NOTCH_THRESHOLD && top >= left + SIDE_DELTA_THRESHOLD && top >= right + SIDE_DELTA_THRESHOLD) {
            return "Top (portrait)";
        }

        if (left <= NOTCH_THRESHOLD && right <= NOTCH_THRESHOLD && top <= NOTCH_THRESHOLD) {
            return "No notch detected (or fullscreen mode not active)";
        }

        if (left > right) {
            return "Left (landscape)";
        }

        if (right > left) {
            return "Right (landscape)";
        }

        return "Unknown";
    }

    // Reads safe-area insets from CSS custom properties and infers notch side.
    function detectNotchPosition() {
        var rootStyle = window.getComputedStyle(document.documentElement);
        var top = parseFloat(rootStyle.getPropertyValue("--safe-top")) || 0;
        var right = parseFloat(rootStyle.getPropertyValue("--safe-right")) || 0;
        var left = parseFloat(rootStyle.getPropertyValue("--safe-left")) || 0;
        var angle = getOrientationAngle();

        var notchPosition = classifyNotchSide(top, left, right);

        var infoElement = document.getElementById("notch-info");
        if (infoElement) {
            infoElement.textContent = "Notch position: " + notchPosition + " (Top: " + top.toFixed(1) + ", Left: " + left.toFixed(1) + ", Right: " + right.toFixed(1) + ", Angle: " + (angle === null ? "n/a" : angle) + ")";
        }

        console.log("Notch position:", notchPosition, { top: top, left: left, right: right, angle: angle });

        return {
            notchPosition: notchPosition,
            top: top,
            left: left,
            right: right
        };
    }

    window.detectNotchPosition = detectNotchPosition;

    function scheduleNotchDetection() {
        window.setTimeout(function () {
            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    detectNotchPosition();
                });
            });
        }, 120);
    }

    window.scheduleNotchDetection = scheduleNotchDetection;

    function runDetectionAfterRotation() {
        scheduleNotchDetection();
    }

    function runInitialDetection() {
        // Delay and wait for layout to ensure CSS env values are stable.
        scheduleNotchDetection();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runInitialDetection);
    } else {
        runInitialDetection();
    }

    window.addEventListener("orientationchange", runDetectionAfterRotation);
    window.addEventListener("resize", scheduleNotchDetection);
})();
