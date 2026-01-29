import * as microsoftTeams from '@microsoft/teams-js';

export interface TeamsContext {
	theme: string;
	locale: string;
	userId: string;
	userPrincipalName?: string;
	tid?: string;
}

class TeamsService {
	private isInitialized = false;
	private context: TeamsContext | null = null;

	async initialize(): Promise<TeamsContext> {
		if (this.isInitialized && this.context) {
			return this.context;
		}

		try {
			await microsoftTeams.app.initialize();
			const context = await microsoftTeams.app.getContext();

			this.context = {
				theme: context.app.theme || 'default',
				locale: context.app.locale || 'en-us',
				userId: context.user?.id || '',
				userPrincipalName: context.user?.userPrincipalName,
				tid: context.user?.tenant?.id,
			};

			this.isInitialized = true;
			return this.context;
		} catch (error) {
			console.error('Failed to initialize Teams SDK:', error);
			// Return mock context for development outside Teams
			this.context = {
				theme: 'default',
				locale: 'en-us',
				userId: 'dev-user',
			};
			return this.context;
		}
	}

	getContext(): TeamsContext | null {
		return this.context;
	}

	isInTeams(): boolean {
		return this.isInitialized;
	}

	/**
	 * Register a theme change handler
	 */
	registerThemeChangeHandler(handler: (theme: string) => void): void {
		microsoftTeams.app.registerOnThemeChangeHandler((theme: string) => {
			if (this.context) {
				this.context.theme = theme;
			}
			handler(theme);
		});
	}

	/**
	 * Get SSO token for authentication
	 */
	async getSSOToken(): Promise<string> {
		try {
			const token = await microsoftTeams.authentication.getAuthToken();
			return token;
		} catch (error) {
			console.error('Failed to get SSO token:', error);
			throw error;
		}
	}
}

export const teamsService = new TeamsService();
