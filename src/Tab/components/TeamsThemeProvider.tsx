import { FluentProvider, teamsLightTheme, teamsDarkTheme, teamsHighContrastTheme, type Theme } from '@fluentui/react-components';
import { type ReactNode, useEffect, useState } from 'react';
import { teamsService } from '../services/teamsService';

interface TeamsThemeProviderProps {
	children: ReactNode;
}

const getTheme = (teamsTheme: string): Theme => {
	switch (teamsTheme) {
		case 'dark':
			return teamsDarkTheme;
		case 'contrast':
			return teamsHighContrastTheme;
		case 'default':
		default:
			return teamsLightTheme;
	}
};

export const TeamsThemeProvider = ({ children }: TeamsThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>(teamsLightTheme);

	useEffect(() => {
		const initializeTheme = async () => {
			const context = await teamsService.initialize();
			setTheme(getTheme(context.theme));

			teamsService.registerThemeChangeHandler((newTheme) => {
				setTheme(getTheme(newTheme));
			});
		};

		initializeTheme();
	}, []);

	return (
		<FluentProvider theme={theme}>
			{children}
		</FluentProvider>
	);
};
