/// <reference types="vitest" />

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
	base: "/UnnamedTierlistMaker2/",
	server: {
		port: 8080,
		host: "127.0.0.1",
		open: true,
		strictPort: false,
	},
	plugins: [svelte()],
	test: {
		coverage: {
			all: true,
			include: ["src/*"],
		},
	},
});
