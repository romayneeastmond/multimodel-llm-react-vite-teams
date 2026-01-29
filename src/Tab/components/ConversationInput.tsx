import { useState } from 'react';
import { Input, Button, Text, makeStyles, tokens } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

interface ConversationInputProps {
	onSubmit: (url: string) => void;
	isLoading: boolean;
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: tokens.spacingVerticalM,
		padding: tokens.spacingVerticalXXL,
		maxWidth: '600px',
		margin: '0 auto',
	},
	title: {
		fontSize: tokens.fontSizeBase400,
		fontWeight: tokens.fontWeightSemibold,
		marginBottom: tokens.spacingVerticalS,
	},
	description: {
		color: tokens.colorNeutralForeground2,
		marginBottom: tokens.spacingVerticalL,
	},
	inputGroup: {
		display: 'flex',
		gap: tokens.spacingHorizontalM,
		alignItems: 'flex-end',
	},
	input: {
		flex: 1,
	},
	examples: {
		marginTop: tokens.spacingVerticalXL,
		padding: tokens.spacingVerticalL,
		backgroundColor: tokens.colorNeutralBackground2,
		borderRadius: tokens.borderRadiusMedium,
	},
	exampleTitle: {
		fontWeight: tokens.fontWeightSemibold,
		marginBottom: tokens.spacingVerticalS,
	},
	exampleList: {
		display: 'flex',
		flexDirection: 'column',
		gap: tokens.spacingVerticalXS,
		paddingLeft: tokens.spacingHorizontalL,
	},
	exampleItem: {
		color: tokens.colorNeutralForeground2,
		fontSize: tokens.fontSizeBase200,
	},
});

export const ConversationInput = ({ onSubmit, isLoading }: ConversationInputProps) => {
	const [url, setUrl] = useState('');
	const styles = useStyles();

	const handleSubmit = () => {
		if (url.trim()) {
			onSubmit(url.trim());
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			handleSubmit();
		}
	};

	return (
		<div className={styles.container}>
			<Text className={styles.title}>View Conversation</Text>
			<Text className={styles.description}>
				Enter a conversation URL or ID to view its content within Teams.
			</Text>

			<div className={styles.inputGroup}>
				<Input
					className={styles.input}
					placeholder="Enter conversation URL or ID..."
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={isLoading}
					size="large"
				/>
				<Button
					appearance="primary"
					icon={<Search24Regular />}
					onClick={handleSubmit}
					disabled={isLoading || !url.trim()}
					size="large"
				>
					{isLoading ? 'Loading...' : 'View'}
				</Button>
			</div>

			<div className={styles.examples}>
				<Text className={styles.exampleTitle}>Supported formats:</Text>
				<ul className={styles.exampleList}>
					<li className={styles.exampleItem}>
						Full share URL: <code>https://your-app.com?share=SESSION_ID&group=GROUP_ID</code>
					</li>
					<li className={styles.exampleItem}>
						Query parameters only: <code>?share=abc123&group=xyz789</code>
					</li>
					<li className={styles.exampleItem}>
						Parameters without '?': <code>share=abc123&group=xyz789</code>
					</li>
				</ul>
			</div>
		</div>
	);
};
