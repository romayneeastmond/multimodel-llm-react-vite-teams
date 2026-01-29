import { getSharedSession, getCosmosConfig } from './cosmosService';

export interface ModelResponse {
	model: string;
	text: string;
	status: 'loading' | 'success' | 'error';
	error?: string;
}

export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
	// For assistant messages with multiple model responses
	responses?: ModelResponse[];
}

export interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Parse conversation share URL from your Multi-Model Orchestrator
 * Format: ?share=SESSION_ID&group=GROUP_ID (group is optional)
 */
export const parseConversationUrl = (url: string): { sessionId: string; groupId?: string } | null => {
	try {
		// If it's a full URL, parse it
		if (url.startsWith('http')) {
			const urlObj = new URL(url);
			const sessionId = urlObj.searchParams.get('share');
			const groupId = urlObj.searchParams.get('group');

			if (sessionId) {
				return { sessionId, groupId: groupId || undefined };
			}
		}

		// Try to parse as query string
		if (url.includes('share=')) {
			const params = new URLSearchParams(url.startsWith('?') ? url : `?${url}`);
			const sessionId = params.get('share');
			const groupId = params.get('group');

			if (sessionId) {
				return { sessionId, groupId: groupId || undefined };
			}
		}

		return null;
	} catch (error) {
		console.error('Failed to parse conversation URL:', error);
		return null;
	}
};

/**
 * Fetch conversation from Cosmos DB using share parameters
 */
export const fetchConversation = async (shareUrl: string): Promise<Conversation> => {
	const parsed = parseConversationUrl(shareUrl);

	if (!parsed) {
		throw new Error('Invalid share URL format. Expected: ?share=SESSION_ID&group=GROUP_ID (group is optional)');
	}

	const config = getCosmosConfig();

	if (!config.endpoint || !config.key) {
		throw new Error('Cosmos DB not configured. Please set environment variables.');
	}

	// Fetch from Cosmos DB using groupId as partition key (if provided)
	const session = await getSharedSession(config, parsed.sessionId, parsed.groupId);

	if (!session) {
		throw new Error('Conversation not found or you do not have access.');
	}

	// Transform Cosmos DB session to Conversation format
	return {
		id: session.id,
		title: session.title || 'Untitled Conversation',
		messages: (session.messages || []).map((msg: any, index: number) => {
			// For assistant messages, extract content from responses object
			let content = msg.content || '';
			let modelResponses: ModelResponse[] | undefined;

			if (msg.role === 'assistant' && msg.responses) {
				// Get ALL successful responses (not just the first one)
				const responsesArray = Object.values(msg.responses) as any[];
				const successfulResponses = responsesArray.filter((r: any) => r.status === 'success' && r.text);

				if (successfulResponses.length > 0) {
					// Map to our ModelResponse interface
					modelResponses = successfulResponses.map((r: any) => ({
						model: r.model || 'Unknown Model',
						text: r.text,
						status: r.status,
						error: r.error
					}));

					// Use the first response as the default content (for backward compatibility)
					content = successfulResponses[0].text;
				}
			}

			return {
				id: msg.id || `msg-${index}`,
				role: msg.role || 'user',
				content,
				timestamp: msg.timestamp || session.createdAt || new Date().toISOString(),
				responses: modelResponses
			};
		}),
		createdAt: session.createdAt || new Date().toISOString(),
		updatedAt: session.updatedAt || session.createdAt || new Date().toISOString()
	};
};
