// @ts-nocheck
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isDev = process.env.NODE_ENV !== "production";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "bugcatch",
            fileName: (format) => `bugcatch.${format}.js`
        },
        rollupOptions: {
            external: ["react", "react-dom", "react-native"]
        },
        sourcemap: isDev,
        minify: true
    },
    define: {
        "process.env": {}
    },
    plugins: [tsconfigPaths()],
    test: {
        // https://vitest.dev/api/
        globals: false,
        environment: "happy-dom",
        setupFiles: "./src/tests/setupTests.ts",
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
