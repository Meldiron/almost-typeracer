const sdk = require('node-appwrite');
const fetch = require('node-fetch');

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

async function isStar(token) {
	const starRes = await fetch('https://api.github.com/user/starred/appwrite/appwrite', {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	const isStared = starRes.status === 204;

	return isStared;
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

	const users = new sdk.Users(client);
	const teams = new sdk.Teams(client);

	const payload = JSON.parse(req.payload ?? '{}');

	const token = payload.token;

	const star = await isStar(token);

	if (!star) {
		res.json({ success: false, message: 'You must star Appwrite repository first.' });
		return;
	}

	const memberships = await users.listMemberships(user.$id);
	let isVip = false;
	for (const membership of memberships.memberships) {
		if (membership.teamId === 'vip') {
			isVip = true;
		}
	}

  if(isVip) {
	res.json({ success: true, message: 'You are already VIP.' });
    return;
  }

	await teams.createMembership('vip', user.email, 'member');

	res.json({ success: true, message: 'You are VIP now.' });
};
