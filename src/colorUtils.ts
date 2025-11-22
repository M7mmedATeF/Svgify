
export const getAlphaFromColor = (color: string): number => {
    color = color.trim();
    if (color === 'none' || color === 'transparent') return 0;
    if (color.startsWith('#')) {
        if (color.length === 9) { // #RRGGBBAA
            return parseInt(color.slice(7), 16) / 255;
        }
        if (color.length === 5) { // #RGBA
            return parseInt(color.slice(4), 16) / 15;
        }
        return 1;
    }
    if (color.startsWith('rgba')) {
        const match = color.match(/rgba\(.*,\s*([\d.]+)\)/);
        if (match) return parseFloat(match[1]);
        return 1;
    }
    // Assume opaque for rgb() and named colors
    return 1;
};

export const generateColorMix = (alpha: number): string => {
    // Round to 2 decimal places for cleaner CSS
    const percentage = Math.round(alpha * 10000) / 100;
    return `color-mix(in srgb, currentColor ${percentage}%, transparent)`;
};
