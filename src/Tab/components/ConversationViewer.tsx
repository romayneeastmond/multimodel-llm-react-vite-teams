import { makeStyles, tokens, Text, Button, TabList, Tab } from '@fluentui/react-components';
import { ArrowLeft24Regular, Calendar24Regular, Person24Regular } from '@fluentui/react-icons';
import type { Conversation, Message } from '../services/conversationService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useState } from 'react';

interface ConversationViewerProps {
	conversation: Conversation;
	onBack: () => void;
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		backgroundColor: tokens.colorNeutralBackground1,
	},
	header: {
		padding: tokens.spacingVerticalL,
		borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
		backgroundColor: tokens.colorNeutralBackground2,
	},
	headerTop: {
		display: 'flex',
		alignItems: 'center',
		gap: tokens.spacingHorizontalM,
		marginBottom: tokens.spacingVerticalS,
	},
	title: {
		fontSize: tokens.fontSizeBase500,
		fontWeight: tokens.fontWeightSemibold,
		flex: 1,
	},
	metadata: {
		display: 'flex',
		gap: tokens.spacingHorizontalL,
		color: tokens.colorNeutralForeground2,
		fontSize: tokens.fontSizeBase200,
		justifyContent: 'space-between'
	},
	metadataItem: {
		display: 'flex',
		alignItems: 'center',
		gap: tokens.spacingHorizontalXS,
	},
	messagesContainer: {
		flex: 1,
		overflowY: 'auto',
		padding: tokens.spacingVerticalXL,
	},
	messageList: {
		display: 'flex',
		flexDirection: 'column',
		gap: tokens.spacingVerticalL,
		maxWidth: '800px',
		margin: '0 auto',
	},
	message: {
		display: 'flex',
		flexDirection: 'column',
		gap: tokens.spacingVerticalXS,
	},
	messageHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: tokens.spacingHorizontalS,
		marginBottom: tokens.spacingVerticalXXS,
	},
	messageRole: {
		fontWeight: tokens.fontWeightSemibold,
		fontSize: tokens.fontSizeBase300,
	},
	messageTime: {
		color: tokens.colorNeutralForeground2,
		fontSize: tokens.fontSizeBase200,
	},
	messageContent: {
		padding: tokens.spacingVerticalM,
		borderRadius: tokens.borderRadiusMedium,
		wordBreak: 'break-word',
	},
	userMessage: {
		backgroundColor: tokens.colorBrandBackground2,
		color: tokens.colorNeutralForeground1,
	},
	assistantMessage: {
		backgroundColor: tokens.colorNeutralBackground3,
		color: tokens.colorNeutralForeground1,
	},
	modelTabs: {
		marginBottom: tokens.spacingVerticalS,
	},
	modelName: {
		fontSize: tokens.fontSizeBase200,
		color: tokens.colorNeutralForeground3,
		marginLeft: tokens.spacingHorizontalXS,
	},
});

const AssistantMessageContent = ({ message, styles }: { message: Message; styles: ReturnType<typeof useStyles> }) => {
	const [selectedModel, setSelectedModel] = useState<string>('');

	if (message.responses && message.responses.length > 1) {
		if (!selectedModel && message.responses.length > 0) {
			setSelectedModel(message.responses[0].model);
		}

		const currentResponse = message.responses.find(r => r.model === selectedModel) || message.responses[0];

		return (
			<>
				<TabList
					selectedValue={selectedModel}
					onTabSelect={(_, data) => setSelectedModel(data.value as string)}
					className={styles.modelTabs}
				>
					{message.responses.map((response) => (
						<Tab key={response.model} value={response.model}>
							{response.model.replace('gemini-', '').replace('azure-', '').replace('claude-', '')}
						</Tab>
					))}
				</TabList>
				<MarkdownRenderer content={currentResponse.text} />
			</>
		);
	}

	return <MarkdownRenderer content={message.content} />;
};

export const ConversationViewer = ({ conversation, onBack }: ConversationViewerProps) => {
	const styles = useStyles();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerTop}>
					<Text className={styles.title}>&nbsp;{conversation.title}</Text>
				</div>
				<div className={styles.metadata}>
					<div className={styles.metadataItem}>
						<Calendar24Regular />
						<span>Created {formatDate(conversation.createdAt)}</span>
					</div>
					<div className={styles.metadataItem}>
						<Person24Regular />
						<span>{conversation.messages.length} messages</span>
					</div>
					<div className={styles.metadataItem}>
						<Button
							appearance="subtle"
							icon={<ArrowLeft24Regular />}
							onClick={onBack}
						>
							Back
						</Button>
					</div>
				</div>
			</div>

			<div className={styles.messagesContainer}>
				<div className={styles.messageList}>
					{conversation.messages.map((message: Message) => (
						<div key={message.id} className={styles.message}>
							<div className={styles.messageHeader}>
								<Text className={styles.messageRole}>
									{message.role === 'user' ? 'You' : 'Assistant'}
								</Text>
								<Text className={styles.messageTime}>
									{formatTime(message.timestamp)}
								</Text>
							</div>
							<div
								className={`${styles.messageContent} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage
									}`}
							>
								{message.role === 'assistant' ? (
									<AssistantMessageContent message={message} styles={styles} />
								) : (
									<MarkdownRenderer content={message.content} />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
