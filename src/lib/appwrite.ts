import { Client, Account, ID, Databases, Query, type Models, Functions } from 'appwrite';
import { AuthStore } from '$lib/authStore';
import { get } from 'svelte/store';

export const launchDate = new Date('2022-09-30');

type DailyMapProfile = {
	dailyMapId: string;
	medalFinish?: boolean;
	medalNoMistake?: boolean;
	medalFastFinish?: boolean;
	score: number;
	userId: string;
} & Models.Document;

type DailyMap = {
	date: string;
	text: string;
} & Models.Document;

const client = new Client()
	.setEndpoint('https://demo.appwrite.io/v1')
	.setProject('almostTypeRacer');

const account = new Account(client);
const database = new Databases(client);
const functions = new Functions(client);

export const AppwriteService = {
	signIn: () => {
		const redirectUrl = window.location.href;
		// account.createOAuth2Session('github', redirectUrl, redirectUrl);
		account.createAnonymousSession();
	},
	signOut: async () => {
		await account.deleteSession('current');
		await AppwriteService.fetchAccount();
	},
	fetchAccount: async () => {
		try {
			const user = await account.get<any>();
			AuthStore.login(user);
		} catch (err) {
			AuthStore.logout();
			console.error(err);
		}
	},
	getDailyMaps: async (year: number, month: number) => {
		const firstDayDate = new Date(year, month, 1);
		const lastDayDate = new Date(year, month + 1, 0);

		return await database.listDocuments<DailyMap>('main', 'dailyMaps', [
			Query.limit(50),
			Query.greaterThanEqual('date', firstDayDate.toISOString()),
			Query.lessThanEqual('date', lastDayDate.toISOString())
		]);
	},
	getDailyMap: async (gameId: string) => {
		return await database.getDocument<DailyMap>('main', 'dailyMaps', gameId);
	},
	getDailyMapProfiles: async (mapIds: string[]) => {
		const user = get(AuthStore);

		if (!user) {
			throw new Error('Please sign in.');
		}

		const userId = user.$id;

		const queries = [Query.limit(mapIds.length), Query.equal('userId', userId)];

		if (mapIds.length > 0) {
			queries.push(Query.equal('dailyMapId', mapIds));
		}

		return await database.listDocuments<DailyMapProfile>('main', 'dailyMapsProfiles', queries);
	},
	submitGame: async (mapId: string, wpm: number, mistakes: number) => {
		const res = await functions.createExecution('dailyMapGame', JSON.stringify({
			wpm,
			mistakes,
			mapId
		}), false);

		if (res.status !== 'completed') {
			throw Error('Function failed with no response.');
		}

		const json = JSON.parse(res.response);

		if (!json.success) {
			throw Error(json.message);
		}

		return json;
	}
};
