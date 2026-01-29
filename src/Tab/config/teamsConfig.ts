export const teamsConfig = {
	cosmos: {
		endpoint: process.env.AZURE_COSMOS_ENDPOINT || '',
		key: process.env.AZURE_COSMOS_KEY || '',
		databaseId: process.env.AZURE_COSMOS_DB_ID || 'ConversationDB',
	},

	auth: {
		clientId: process.env.AZURE_AD_CLIENT_ID || '',
		authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}`,
		redirectUri: process.env.AZURE_AD_REDIRECT_URI || window.location.origin,
	},

	teamsAppId: process.env.TEAMS_APP_ID || '',

	cache: {
		cacheLocation: 'sessionStorage' as const,
		storeAuthStateInCookie: false,
	},
};
