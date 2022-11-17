import dotenv from 'dotenv';

dotenv.config();

import { Client, Databases, ID, Query } from 'node-appwrite';
import { readFileSync } from 'fs';

const seeds = JSON.parse(readFileSync('seeds.json').toString());

seeds.reverse();

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT)
	.setProject(process.env.APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(client);

for (const seed of seeds) {
	const docs = await database.listDocuments('main', 'dailyMaps', [
		Query.limit(1),
		Query.equal('date', seed.date)
	]);

	if (docs.documents.length > 0) {
		console.log(`Skipping ${seed.date}.`);
	} else {
		console.log(`Importing ${seed.date}.`);
		await database.createDocument('main', 'dailyMaps', ID.unique(), {
			text: seed.text,
			textAfter: seed.textAfter,
			textBefore: seed.textBefore,
			date: seed.date
		});
	}
}

console.log('Done');
