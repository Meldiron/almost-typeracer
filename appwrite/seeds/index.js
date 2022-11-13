import dotenv from 'dotenv';

dotenv.config();

// TODO: Warnings/Errors for beter DevEx

import { Client, Databases, ID, Query } from 'node-appwrite';
import { readFileSync } from 'fs';

const seeds = JSON.parse(readFileSync('seed.json').toString());

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT)
	.setProject(process.env.APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(client);

for (const seed of seeds) {
	const date = new Date(`${seed.day}T00:00:00.000Z`);

	const docs = await database.listDocuments('main', 'dailyMaps', [
		Query.limit(1),
		Query.equal('date', date.toISOString())
	]);

	if (docs.documents.length > 0) {
		console.log(`Skipping ${seed.day}.`);
	} else {
		console.log(`Importing ${seed.day}.`);
		await database.createDocument('main', 'dailyMaps', ID.unique(), {
			text: seed.text,
			date: date.toISOString()
		});
	}
}

console.log('Done');
