import { defineConfig } from "vite";

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: "src/travels-map/index.ts",
            name: "TravelsMapElement",
            fileName: "travels-map",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
    },
});
