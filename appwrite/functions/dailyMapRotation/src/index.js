const sdk = require('node-appwrite');

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

function isPastDate(date) {
	const dateNow = new Date();
	dateNow.setHours(0, 0, 0, 0);
	return date <= dateNow;
}

function isRecentDate(date) {
	const dateNow = new Date();
	dateNow.setDate(dateNow.getDate() - 7);
	return date >= dateNow;
}

module.exports = async function (req, res) {
	const client = new sdk.Client();

	if (!req.variables['APPWRITE_FUNCTION_ENDPOINT'] || !req.variables['APPWRITE_FUNCTION_API_KEY']) {
		throw Error('Variables not set up properly.');
	}

	client
		.setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
		.setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
		.setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

	const database = new sdk.Databases(client);

	let cursor = null;

	do {
		const queries = [sdk.Query.limit(100)];

		if (cursor) {
			queries.push(sdk.Query.cursorAfter(cursor));
		}

		const page = await database.listDocuments('main', 'dailyMaps', queries);

		for (const document of page.documents) {
			let state = 'private';

			const date = new Date(document.date);

			if (isPastDate(date) && isRecentDate(date)) {
				state = 'public';
			} else if (isPastDate(date)) {
				state = 'vip';
			} else {
				state = 'private';
			}

			console.log(`Marking ${document.$id} ${document.date} as ${state}`);

			const permissions =
				state === 'public'
					? [sdk.Permission.read(sdk.Role.any())]
					: state === 'vip'
					? [sdk.Permission.read(sdk.Role.team('vip'))]
					: [];

			await database.updateDocument('main', 'dailyMaps', document.$id, undefined, permissions);
		}

		cursor = page.documents.length <= 0 ? null : page.documents[page.documents.length - 1].$id;
	} while (cursor !== null);

	res.json({
		success: true
	});
};
