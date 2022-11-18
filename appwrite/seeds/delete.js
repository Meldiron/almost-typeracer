import dotenv from 'dotenv';

dotenv.config();

import { Client, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT)
	.setProject(process.env.APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(client);

let size = 0;
do {
	const docs = await database.listDocuments('main', 'dailyMaps', [
		Query.limit(100),
	]);

	for(const doc of docs.documents) {
		await database.deleteDocument('main', 'dailyMaps', doc.$id);
	}

	size = docs.documents.length;
} while(size > 0);

console.log('Done');
