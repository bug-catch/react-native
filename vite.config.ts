// @ts-nocheck
import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json" assert { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            name: "bugcatch",
            formats: ["es", "umd"],
            entry: path.resolve(__dirname, "src/index.ts"),
            fileName: (format) => (format === "es" ? `index.js` : `index.${format}.js`)
        },
        rollupOptions: {
            // Don't bundle dependencies.
            // Don't bundle built-in Node.js modules.
            external: [...Object.keys(pkg.dependencies), /^node:.*/]
        },
        minify: true
    },
    define: {
        "process.env": {}
    },
    plugins: [tsconfigPaths(), dts()],
    test: {
        // https://vitest.dev/api/
        globals: false,
        environment: "happy-dom",
        setupFiles: "./__tests__/setupTests.ts",
        deps: {
            inline: ["react", "react-native", "react-native-exception-handler"]
        },
        coverage: {
            enabled: false,
            provider: "v8"
        },
        benchmark: {
            include: ["**/*.{bench,benchmark}.?(c|m)[jt]s?(x)"],
            exclude: ["node_modules", "dist", ".idea", ".git", ".cache"]
        },
        // Debug
        logHeapUsage: true
    }
});
