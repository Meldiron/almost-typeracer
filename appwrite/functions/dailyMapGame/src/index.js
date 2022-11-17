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

async function getMapAsUser(req, jwt, mapId) {
	const client = new sdk.Client();

	client
		.setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
		.setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
		.setJWT(jwt);

	const database = new sdk.Databases(client);

	try {
		return await database.getDocument('main', 'dailyMaps', mapId);
	} catch (err) {
		return null;
	}
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

	const payload = JSON.parse(req.payload ?? '{}');

	const wpm = payload.wpm;
	const mistakes = payload.mistakes;
	const mapId = payload.mapId;

	const userJwt = req.variables['APPWRITE_FUNCTION_JWT'];
	const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];

	const mapDocument = await getMapAsUser(req, userJwt, mapId);

	if (mapDocument === null) {
		res.json({ success: false, message: 'You are not allowed to play this day.' });
		return;
	}

	const search = await database.listDocuments('main', 'dailyMapsProfiles', [
		sdk.Query.limit(1),
		sdk.Query.equal('userId', userId),
		sdk.Query.equal('dailyMapId', mapId)
	]);

	const profileDocument = search.documents[0];

	const document = {
		dailyMapId: mapId,
		userId: userId,
		score: wpm,
		medalFinish: true,
		medalNoMistake: mistakes === 0,
		medalFastFinish: wpm >= 60
	};

	if (profileDocument) {
		document.score = Math.max(document.score, profileDocument.score);
		document.medalFinish = document.medalFinish || profileDocument.medalFinish;
		document.medalNoMistake = document.medalNoMistake || profileDocument.medalNoMistake;
		document.medalFastFinish = document.medalFastFinish || profileDocument.medalFastFinish;

		await database.updateDocument('main', 'dailyMapsProfiles', profileDocument.$id, document);
	} else {
		await database.createDocument('main', 'dailyMapsProfiles', sdk.ID.unique(), document);
	}

	res.json({
		success: true,
		message: "Game successfully saved."
	});
};
