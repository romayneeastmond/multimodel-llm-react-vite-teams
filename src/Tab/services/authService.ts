import { PublicClientApplication } from '@azure/msal-browser';
import { teamsConfig } from '../config/teamsConfig';
import { teamsService } from './teamsService';

const msalConfig = {
	auth: teamsConfig.auth,
	cache: teamsConfig.cache,
};

let msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = (): PublicClientApplication => {
	if (!msalInstance) {
		msalInstance = new PublicClientApplication(msalConfig);
	}
	return msalInstance;
};

/**
 * Initialize authentication (Teams context or MSAL)
 * Note: Cosmos DB access doesn't require authentication tokens,
 * but we can still use Teams context for user identification
 */
export const initializeAuth = async (): Promise<void> => {
	try {
		// Initialize Teams SDK if running in Teams
		if (teamsService.isInTeams()) {
			await teamsService.initialize();
		}
	} catch (error) {
		console.warn('Teams initialization failed:', error);
	}
};

/**
 * Get current user information from Teams or MSAL
 */
export const getUserInfo = async () => {
	// Try Teams first
	const teamsContext = teamsService.getContext();
	if (teamsContext && teamsContext.userPrincipalName) {
		return {
			name: teamsContext.userPrincipalName,
			username: teamsContext.userPrincipalName,
		};
	}

	// Fall back to MSAL
	const msal = getMsalInstance();
	await msal.initialize();

	const accounts = msal.getAllAccounts();
	if (accounts.length > 0) {
		return {
			name: accounts[0].name,
			username: accounts[0].username,
		};
	}

	return null;
};
