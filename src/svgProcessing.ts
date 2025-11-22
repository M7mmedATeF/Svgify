import { generateColorMix, getAlphaFromColor } from "./colorUtils";

/**
 * Inlines CSS styles from <style> blocks into matching elements
 */
export const inlineStyleBlocks = (doc: Document): void => {
    const styleElements = doc.querySelectorAll("style");
    styleElements.forEach((styleEl) => {
        const cssContent = styleEl.textContent || "";
        const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
        let match;

        while ((match = ruleRegex.exec(cssContent)) !== null) {
            const selector = match[1].trim();
            const cssText = match[2].trim();

            try {
                const elements = doc.querySelectorAll(selector);
                elements.forEach((el) => {
                    const svgEl = el as unknown as SVGElement;
                    const styleRules = cssText.split(";");

                    styleRules.forEach((rule) => {
                        const [prop, val] = rule.split(":").map((s) => s.trim());
                        if (prop && val) {
                            svgEl.style.setProperty(prop, val);
                        }
                    });
                });
            } catch (e) {
                console.warn(
                    "Invalid selector or error applying style:",
                    selector,
                    e
                );
            }
        }

        styleEl.remove();
    });
};

/**
 * Processes colors on an element based on opacity and color values
 */
export const processElementColors = (
    el: Element,
    FontWeight: string
): void => {
    const svgEl = el as unknown as SVGElement;

    // Remove class attribute
    if (el.hasAttribute("class")) {
        el.removeAttribute("class");
    }

    // Get opacity attribute if it exists
    const opacityAttr = el.getAttribute("opacity");
    const elementOpacity = opacityAttr ? parseFloat(opacityAttr) : 1;

    // Helper to process color with opacity
    const processColor = (val: string | null): string | null => {
        if (!val) return null;
        const colorAlpha = getAlphaFromColor(val);
        const finalAlpha = colorAlpha * elementOpacity;
        return generateColorMix(finalAlpha);
    };

    // Remove opacity attribute after we've used it
    if (opacityAttr) {
        el.removeAttribute("opacity");
    }

    // Check what the element currently has
    const hasFillAttr = el.hasAttribute("fill");
    const hasStrokeAttr = el.hasAttribute("stroke");
    const hasFillStyle = svgEl.style && svgEl.style.getPropertyValue("fill");
    const hasStrokeStyle =
        svgEl.style && svgEl.style.getPropertyValue("stroke");

    // Process existing attributes
    ["fill", "stroke"].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val) {
            const newVal = processColor(val);
            if (newVal) {
                el.setAttribute(attr, newVal);
            }
        }
    });

    // Process existing styles
    if (svgEl.style) {
        ["fill", "stroke"].forEach((prop) => {
            const val = svgEl.style.getPropertyValue(prop);
            if (val) {
                const newVal = processColor(val);
                if (newVal) {
                    svgEl.style.setProperty(prop, newVal);
                }
            }
        });
    }

    // Apply FontWeight logic
    applyFontWeightLogic(
        el,
        svgEl,
        FontWeight,
        hasFillAttr,
        hasStrokeAttr,
        hasFillStyle,
        hasStrokeStyle
    );
};

/**
 * Applies FontWeight-specific logic to force or preserve fill/stroke
 */
const applyFontWeightLogic = (
    el: Element,
    svgEl: SVGElement,
    FontWeight: string,
    hasFillAttr: boolean,
    hasStrokeAttr: boolean,
    hasFillStyle: string | false,
    hasStrokeStyle: string | false
): void => {
    if (FontWeight === "fill") {
        // Force fill on all elements
        if (!hasFillAttr && !hasFillStyle) {
            el.setAttribute(
                "fill",
                "color-mix(in srgb, currentColor 100%, transparent)"
            );
        }
        // Remove stroke
        el.setAttribute("stroke", "none");
        if (svgEl.style) {
            svgEl.style.removeProperty("stroke");
        }
    } else if (FontWeight === "stroke") {
        // Force stroke on all elements
        if (!hasStrokeAttr && !hasStrokeStyle) {
            el.setAttribute(
                "stroke",
                "color-mix(in srgb, currentColor 100%, transparent)"
            );
        }
        // Remove fill
        el.setAttribute("fill", "none");
        if (svgEl.style) {
            svgEl.style.removeProperty("fill");
        }
    } else if (FontWeight === "both") {
        // Force both - ensure all elements have both fill and stroke
        if (!hasFillAttr && !hasFillStyle) {
            el.setAttribute(
                "fill",
                "color-mix(in srgb, currentColor 100%, transparent)"
            );
        }
        if (!hasStrokeAttr && !hasStrokeStyle) {
            el.setAttribute(
                "stroke",
                "color-mix(in srgb, currentColor 100%, transparent)"
            );
        }
    } else {
        // FontWeight === "default": preserve structure but make it explicit
        if ((hasFillAttr || hasFillStyle) && !hasStrokeAttr && !hasStrokeStyle) {
            el.setAttribute("stroke", "none");
        }
        if (
            (hasStrokeAttr || hasStrokeStyle) &&
            !hasFillAttr &&
            !hasFillStyle
        ) {
            el.setAttribute("fill", "none");
        }
    }
};

/**
 * Cleans the root SVG element by removing fill/stroke attributes
 */
export const cleanRootSvg = (doc: Document): void => {
    const rootSvg = doc.documentElement;
    rootSvg.removeAttribute("fill");
    rootSvg.removeAttribute("stroke");
};

/**
 * Adjusts SVG dimensions based on scale factor
 */
export const adjustSvgDimensions = (svg: string, Scale: number): string => {
    // Calculate aspect ratio
    const widthMatch = svg.match(/width="(\d+(\.\d+)?(px|em|rem|%)?)"/);
    const heightMatch = svg.match(/height="(\d+(\.\d+)?(px|em|rem|%)?)"/);
    let aspectRatio = 1;

    if (widthMatch && heightMatch) {
        const originalWidth = parseFloat(widthMatch[1]);
        const originalHeight = parseFloat(heightMatch[1]);
        aspectRatio = originalHeight / originalWidth;
    } else {
        // Add default width and height if missing
        if (!widthMatch) svg = svg.replace("<svg", `<svg width="1em"`);
        if (!heightMatch) svg = svg.replace("<svg", `<svg height="1em"`);
    }

    // Adjust dimensions based on Scale prop
    svg = svg.replace(
        /height="[^"]*"/,
        `height="${Scale * 1.5 * aspectRatio}em"`
    );
    svg = svg.replace(/width="[^"]*"/, `width="${Scale * 1.5}em"`);

    return svg;
};
