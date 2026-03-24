function detectNotchPosition() {
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
        const insets = {
            top: parseFloat(computed.paddingTop) || 0,
            right: parseFloat(computed.paddingRight) || 0,
            bottom: parseFloat(computed.paddingBottom) || 0,
            left: parseFloat(computed.paddingLeft) || 0
        };

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

        if (edges.length > 1 && strongest.value === edges[1].value) {
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
    } finally {
        if (probe.parentNode) {
            probe.parentNode.removeChild(probe);
        }
    }
}
