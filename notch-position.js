(function () {
    "use strict";

    var NOTCH_THRESHOLD = 20;

    // Reads safe-area insets from CSS custom properties and infers notch side.
    function detectNotchPosition() {
        var rootStyle = window.getComputedStyle(document.documentElement);
        var top = parseInt(rootStyle.getPropertyValue("--safe-top"), 10) || 0;
        var right = parseInt(rootStyle.getPropertyValue("--safe-right"), 10) || 0;
        var left = parseInt(rootStyle.getPropertyValue("--safe-left"), 10) || 0;

        var notchPosition = "No notch detected (or fullscreen mode not active)";

        // Values above this threshold are treated as notch/cutout indicators.
        if (top > NOTCH_THRESHOLD) {
            notchPosition = "Top (portrait)";
        } else if (left > NOTCH_THRESHOLD) {
            notchPosition = "Left (landscape)";
        } else if (right > NOTCH_THRESHOLD) {
            notchPosition = "Right (landscape)";
        }

        var infoElement = document.getElementById("notch-info");
        if (infoElement) {
            infoElement.textContent = "Notch position: " + notchPosition + " (Top: " + top + ", Left: " + left + ", Right: " + right + ")";
        }

        console.log("Notch position:", notchPosition, { top: top, left: left, right: right });

        return {
            notchPosition: notchPosition,
            top: top,
            left: left,
            right: right
        };
    }

    window.detectNotchPosition = detectNotchPosition;

    function runDetectionAfterRotation() {
        window.setTimeout(detectNotchPosition, 100);
    }

    function runInitialDetection() {
        // Delay one tick so CSS env values settle before first render.
        window.setTimeout(detectNotchPosition, 0);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runInitialDetection);
    } else {
        runInitialDetection();
    }

    window.addEventListener("orientationchange", runDetectionAfterRotation);
    window.addEventListener("resize", detectNotchPosition);
})();
