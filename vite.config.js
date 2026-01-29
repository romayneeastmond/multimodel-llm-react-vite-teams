import { defineConfig, loadEnv } from 'vite';
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');

	return {
		plugins: [
			react()
		],
		define: {
			'process.env.AZURE_COSMOS_ENDPOINT': JSON.stringify(process.env.AZURE_COSMOS_ENDPOINT || env.AZURE_COSMOS_ENDPOINT),
			'process.env.AZURE_COSMOS_KEY': JSON.stringify(process.env.AZURE_COSMOS_KEY || env.AZURE_COSMOS_KEY),
			'process.env.AZURE_COSMOS_DB_ID': JSON.stringify(process.env.AZURE_COSMOS_DB_ID || env.AZURE_COSMOS_DB_ID),
			'process.env.AZURE_AD_CLIENT_ID': JSON.stringify(process.env.AZURE_AD_CLIENT_ID || env.AZURE_AD_CLIENT_ID),
			'process.env.AZURE_AD_TENANT_ID': JSON.stringify(process.env.AZURE_AD_TENANT_ID || env.AZURE_AD_TENANT_ID),
			'process.env.AZURE_AD_REDIRECT_URI': JSON.stringify(process.env.AZURE_AD_REDIRECT_URI || env.AZURE_AD_REDIRECT_URI),
			'process.env.TEAMS_APP_ID': JSON.stringify(process.env.TEAMS_APP_ID || env.TEAMS_APP_ID),
		},
		base: "/tabs/home",
		esbuild: {
			tsconfigRaw: fs.readFileSync("./tsconfig.app.json"),
		},
	};
});
