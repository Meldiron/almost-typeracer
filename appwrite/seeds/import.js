import dotenv from 'dotenv';

dotenv.config();

import { Client, Databases, ID, Query } from 'node-appwrite';
import { readFileSync } from 'fs';

const seeds = JSON.parse(readFileSync('seeds.json').toString());

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT)
	.setProject(process.env.APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(client);

let date = new Date('2022-01-01T00:00:00+0000');

for (const seed of seeds) {
	seed.date = date.toISOString();

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

	date = new Date(date.getTime() + (1000*86400));
}

console.log('Done');
