import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/travels-map/index.ts",
            name: "TravelsMapElement",
            fileName: "travel-map",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
    },
});
