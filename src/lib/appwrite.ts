import { Client, Account, ID } from 'appwrite';
import { AuthStore } from '$lib/authStore';

const client = new Client()
	.setEndpoint('https://demo.appwrite.io/v1')
	.setProject('almostTypeRacer');

const account = new Account(client);

export const AppwriteService = {
	signIn: () => {
		const redirectUrl = window.location.href;
		account.createOAuth2Session('github', redirectUrl, redirectUrl);
	},
	signOut: async () => {
		await account.deleteSession('current');
        await AppwriteService.fetchAccount();
	},
    fetchAccount: async () => {
        try {
            const user = await account.get<any>();
            AuthStore.login(user);
        } catch(err) {
            AuthStore.logout();
            console.error(err);
        }
    }
};
