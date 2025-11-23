import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, "src/index.ts"),
                SvgifyContext: path.resolve(__dirname, "src/SvgifyContext.tsx"),
            },
            name: "svgify",
            fileName: (format, entryName) => {
                const ext = format === "es" ? "mjs" : format === "cjs" ? "cjs" : "js";
                return `${entryName}.${ext}`;
            },
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                banner: '"use client";',
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        cssMinify: true,
        minify: true,
        emptyOutDir: true,
        cssCodeSplit: true,
    },
    plugins: [
        react(),
        dts({
            outDir: "dist/types", // Specifies the output directory for the .d.ts files
            entryRoot: "src", // Ensures src/ is not reflected in the output structure
        }),
    ],
});
