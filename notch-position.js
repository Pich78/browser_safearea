function detectNotchPosition(inputInsets) {
    function parsePx(value) {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function normalizeInsets(raw) {
        const insets = raw || {};
        return {
            top: parsePx(insets.top),
            right: parsePx(insets.right),
            bottom: parsePx(insets.bottom),
            left: parsePx(insets.left)
        };
    }

    function hasPositiveInset(insets) {
        return insets.top > 0 || insets.right > 0 || insets.bottom > 0 || insets.left > 0;
    }

    function readInsetsFromCssVars() {
        const root = getComputedStyle(document.documentElement);
        return normalizeInsets({
            top: root.getPropertyValue('--safe-area-top'),
            right: root.getPropertyValue('--safe-area-right'),
            bottom: root.getPropertyValue('--safe-area-bottom'),
            left: root.getPropertyValue('--safe-area-left')
        });
    }

    function readInsetsFromProbe() {
        const probe = document.createElement('div');
        try {
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
            return normalizeInsets({
                top: computed.paddingTop,
                right: computed.paddingRight,
                bottom: computed.paddingBottom,
                left: computed.paddingLeft
            });
        } finally {
            if (probe.parentNode) {
                probe.parentNode.removeChild(probe);
            }
        }
    }

    try {
        const providedInsets = normalizeInsets(inputInsets);
        const cssInsets = readInsetsFromCssVars();
        const insets = hasPositiveInset(providedInsets)
            ? providedInsets
            : hasPositiveInset(cssInsets)
                ? cssInsets
                : readInsetsFromProbe();

        const orientationType = (window.screen.orientation && window.screen.orientation.type) || '';
        const edges = [
            { edge: 'top', value: insets.top },
            { edge: 'right', value: insets.right },
            { edge: 'bottom', value: insets.bottom },
            { edge: 'left', value: insets.left }
        ];

        edges.sort((a, b) => b.value - a.value);

        const strongest = edges[0];
        if (!strongest || strongest.value <= 0) {
            return 'none';
        }

        if (edges.length > 1 && Math.abs(strongest.value - edges[1].value) < 0.5) {
            if (orientationType.indexOf('portrait-primary') === 0) return 'up';
            if (orientationType.indexOf('portrait-secondary') === 0) return 'down';
            if (orientationType.indexOf('landscape-primary') === 0) return 'left';
            if (orientationType.indexOf('landscape-secondary') === 0) return 'right';

            const orientation = window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
            return orientation === 'portrait' ? 'up' : 'left';
        }

        if (strongest.edge === 'top') return 'up';
        if (strongest.edge === 'bottom') return 'down';
        if (strongest.edge === 'left') return 'left';
        return 'right';
    } catch (error) {
        console.error('[SafeArea] detectNotchPosition failed:', error);
        return 'none';
    }
}
