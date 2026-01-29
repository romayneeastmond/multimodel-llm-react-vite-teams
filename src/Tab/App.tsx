import { useState, useEffect } from 'react';
import { TeamsThemeProvider } from './components/TeamsThemeProvider';
import { ConversationInput } from './components/ConversationInput';
import { ConversationViewer } from './components/ConversationViewer';
import { Spinner, Text, makeStyles, tokens } from '@fluentui/react-components';
import { initializeAuth } from './services/authService';
import { fetchConversation, type Conversation } from './services/conversationService';
import './App.css';

const useStyles = makeStyles({
	container: {
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: tokens.colorNeutralBackground1,
		color: tokens.colorNeutralForeground1,
	},
	loading: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		gap: tokens.spacingVerticalL,
		backgroundColor: tokens.colorNeutralBackground1,
		color: tokens.colorNeutralForeground1,
	},
	error: {
		padding: tokens.spacingVerticalXXL,
		textAlign: 'center',
		color: tokens.colorPaletteRedForeground1,
	},
});

function App() {
	const styles = useStyles();
	const [isLoading, setIsLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				await initializeAuth();
			} catch (err) {
				console.error('Initialization failed:', err);
			} finally {
				setIsInitializing(false);
			}
		};

		init();
	}, []);

	const handleConversationSubmit = async (url: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const conversationData = await fetchConversation(url);
			setConversation(conversationData);
		} catch (err) {
			console.error('Failed to fetch conversation:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to load conversation. Please check the URL and try again.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		setConversation(null);
		setError(null);
	};

	if (isInitializing) {
		return (
			<TeamsThemeProvider>
				<div className={styles.loading}>
					<Spinner size="huge" label="Initializing..." />
				</div>
			</TeamsThemeProvider>
		);
	}

	return (
		<TeamsThemeProvider>
			<div className={styles.container}>
				{error && (
					<div className={styles.error}>
						<Text size={400} weight="semibold">
							{error}
						</Text>
					</div>
				)}

				{conversation ? (
					<ConversationViewer conversation={conversation} onBack={handleBack} />
				) : (
					<ConversationInput onSubmit={handleConversationSubmit} isLoading={isLoading} />
				)}
			</div>
		</TeamsThemeProvider>
	);
}

export default App;
