import { CosmosClient } from "@azure/cosmos";

export interface CosmosConfig {
	endpoint: string;
	key: string;
	databaseId: string;
}

export const getSharedSession = async (config: CosmosConfig, sessionId: string, partitionKey?: string): Promise<any | null> => {
	const client = new CosmosClient({ endpoint: config.endpoint, key: config.key });
	const container = client.database(config.databaseId).container("Conversations");

	try {
		if (partitionKey) {
			const { resource } = await container.item(sessionId, partitionKey).read();
			return resource || null;
		} else {
			const query = {
				query: "SELECT * FROM c WHERE c.id = @sessionId",
				parameters: [{ name: "@sessionId", value: sessionId }]
			};

			const { resources } = await container.items.query(query).fetchAll();
			return resources.length > 0 ? resources[0] : null;
		}
	} catch (error) {
		console.error("Error fetching shared session:", error);
		return null;
	}
};

export const getCosmosConfig = (): CosmosConfig => {
	return {
		endpoint: process.env.AZURE_COSMOS_ENDPOINT || '',
		key: process.env.AZURE_COSMOS_KEY || '',
		databaseId: process.env.AZURE_COSMOS_DB_ID || 'ConversationDB'
	};
};
