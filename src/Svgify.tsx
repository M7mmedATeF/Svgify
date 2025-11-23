"use client";

import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { SvgifyProps } from "./types";
import { useSvgifyContext } from "./SvgifyContext";
import {
    inlineStyleBlocks,
    processElementColors,
    cleanRootSvg,
    adjustSvgDimensions,
} from "./svgProcessing";

/**
 * Svgify component: Fetches and displays SVG icons with smart color mixing and customization.
 *
 * Features:
 * - Automatic color inheritance via currentColor
 * - Transparency preservation using color-mix()
 * - FontWeight modes: default, fill, stroke, both
 * - Caching for performance
 * - Support for class-based and inline styles
 *
 * @param IconName - The name of the SVG icon (filename without extension)
 * @param FontWeight - Display mode: "default" | "fill" | "stroke" | "both" (default: "default")
 * @param Scale - Scale factor for the icon size (default: 1)
 * @param className - Custom CSS class for the SVG icon
 * @param style - Inline styles for the component
 * @param LoadingElement - Element to show while the SVG is loading
 * @param NotFoundElement - Element to show if the SVG is not found
 */
const Svgify: React.FC<SvgifyProps> = ({
    IconName = "",
    className = "",
    Scale = 1,
    FontWeight = "default",
    LoadingElement = "",
    NotFoundElement = "",
    ...props
}) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const { version, clearForOldVersion, FetchIcon } = useSvgifyContext();

    useEffect(() => {
        const cacheKey = `svgify_${version}_${IconName}_${FontWeight}`;

        // Clean up old cache versions
        const cleanupOldCache = () => {
            const cachedVersion =
                Number(localStorage.getItem("svgify_cached_version")) || -1;

            if (cachedVersion !== version) {
                localStorage.setItem(
                    "svgify_cached_version",
                    JSON.stringify(version)
                );

                // Remove old version entries
                for (const key of Object.keys(localStorage)) {
                    if (
                        key.startsWith(`svgify_`) &&
                        !key.includes(`${version}`) &&
                        key !== "svgify_cached_version"
                    ) {
                        localStorage.removeItem(key);
                    }
                }

                if (clearForOldVersion) {
                    localStorage.removeItem(`svgify_${IconName}`);
                }
            }
        };

        const fetchAndProcessSvg = async () => {
            try {
                // Check cache first
                let svg = localStorage.getItem(cacheKey) || "";

                if (!svg && FetchIcon) {
                    // Fetch from server
                    const response = await FetchIcon(IconName);

                    if (response?.data) {
                        svg = "" + response.data;

                        // Validate SVG format
                        if (svg.match(/<html/g)) {
                            throw new Error("Invalid SVG format");
                        }

                        // Process SVG
                        svg = processSvg(svg, FontWeight);

                        // Cache the processed SVG
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify(svg));
                        } catch (e) {
                            if (e instanceof DOMException && e.code === 22) {
                                console.warn(
                                    "Storage quota exceeded, clearing storage..."
                                );
                                localStorage.clear();
                            } else {
                                throw e;
                            }
                        }
                    }
                } else {
                    svg = JSON.parse(svg);
                }

                // Adjust dimensions
                svg = adjustSvgDimensions(svg, Scale);

                setSvgContent(svg);
            } catch (error) {
                setSvgContent("SVGIFY_ERROR");
                console.error("Error fetching SVG:", error);
            }
        };

        cleanupOldCache();
        fetchAndProcessSvg();
    }, [IconName, Scale, FontWeight, version, clearForOldVersion, FetchIcon]);

    return (
        <span
            className={`svg-font-icon svg_modifier_style ${className || ""}`}
            {...props}
        >
            {svgContent
                ? svgContent === "SVGIFY_ERROR"
                    ? NotFoundElement
                    : parse(svgContent)
                : LoadingElement}
        </span>
    );
};

/**
 * Processes an SVG string by:
 * 1. Inlining <style> blocks
 * 2. Processing colors with transparency
 * 3. Applying FontWeight logic
 * 4. Cleaning root SVG attributes
 */
const processSvg = (svg: string, FontWeight: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");

    // Inline styles from <style> blocks
    inlineStyleBlocks(doc);

    // Process all elements
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
        processElementColors(el, FontWeight);
    });

    // Clean root SVG
    cleanRootSvg(doc);

    return doc.documentElement.outerHTML;
};

export default Svgify;
