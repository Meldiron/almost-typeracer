import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

function create() {
	const { subscribe, set } = writable<Models.Account<any>|null>(null);

	return {
		subscribe,
        login: (account: Models.Account<any>) => set(account),
        logout: () => set(null)
	};
}

export const AuthStore = create();