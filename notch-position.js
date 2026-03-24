(function () {
    "use strict";

    // Reads safe-area insets from CSS custom properties and infers notch side.
    function detectNotchPosition() {
        var rootStyle = window.getComputedStyle(document.documentElement);
        var top = parseInt(rootStyle.getPropertyValue("--safe-top"), 10) || 0;
        var right = parseInt(rootStyle.getPropertyValue("--safe-right"), 10) || 0;
        var left = parseInt(rootStyle.getPropertyValue("--safe-left"), 10) || 0;

        var notchPosition = "Nessun notch (o schermo intero non attivo)";

        // Values above this threshold are treated as notch/cutout indicators.
        if (top > 20) {
            notchPosition = "In Alto (Portrait)";
        } else if (left > 20) {
            notchPosition = "A Sinistra (Landscape)";
        } else if (right > 20) {
            notchPosition = "A Destra (Landscape)";
        }

        var infoElement = document.getElementById("notch-info");
        if (infoElement) {
            infoElement.innerText = "Posizione Notch: " + notchPosition + " (Top: " + top + ", Left: " + left + ", Right: " + right + ")";
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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", detectNotchPosition);
    } else {
        detectNotchPosition();
    }

    window.addEventListener("orientationchange", runDetectionAfterRotation);
    window.addEventListener("resize", detectNotchPosition);
})();
