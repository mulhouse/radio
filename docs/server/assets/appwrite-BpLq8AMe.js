import { Account, Client, Storage, Users } from "node-appwrite";
var getAppwriteClientCredentials = () => {
	const endpoint = process.env.APPWRITE_ENDPOINT;
	if (!endpoint) throw new Error("APPWRITE_ENDPOINT is not set");
	const projectId = process.env.APPWRITE_PROJECT_ID;
	if (!projectId) throw new Error("APPWRITE_PROJECT_ID is not set");
	const apiKey = process.env.APPWRITE_API_KEY;
	if (!apiKey) throw new Error("APPWRITE_API_KEY is not set");
	return {
		endpoint,
		projectId,
		apiKey
	};
};
async function createSessionClient(session) {
	const { endpoint, projectId } = getAppwriteClientCredentials();
	const client = new Client().setEndpoint(endpoint).setProject(projectId);
	client.setSession(session);
	return {
		client,
		account: new Account(client),
		users: new Users(client),
		storage: new Storage(client)
	};
}
function createAdminClient() {
	const { endpoint, projectId, apiKey } = getAppwriteClientCredentials();
	const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
	return {
		client,
		account: new Account(client)
	};
}
export { createSessionClient as n, createAdminClient as t };

//# sourceMappingURL=appwrite-BpLq8AMe.js.map