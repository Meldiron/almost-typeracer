<script>
	import '../app.css';
	import { AppwriteService } from '$lib/appwrite';
	import { onMount } from 'svelte';
	import { AuthStore } from '$lib/authStore';

	let loading = true;

	onMount(async () => {
		await AppwriteService.fetchAccount();
		loading = false;
	});
</script>

<div class="mx-auto max-w-4xl">
	{#if loading}
		<section class="mt-12 flex items-center justify-center">
			<svg
				class="animate-spin h-6 w-6 text-slate-900"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		</section>
	{:else}
		<header
			class="my-6 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between space-x-3"
		>
			<a href="/" class="text-2xl font-bold text-slate-900">Almost TypeRacer</a>

			<div>
				{#if $AuthStore === null}
					<button
						on:click={() => AppwriteService.signIn()}
						class="rounded-lg px-4 py-2 bg-[#181717] text-[#ffffff] flex items-center justify-center space-x-2"
					>
						<svg
							role="img"
							viewBox="0 0 24 24"
							class="w-4 h-4"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							><title>GitHub</title><path
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
							/></svg
						>
						<span>Sign In with GitHub</span>
					</button>
				{:else}
					<button
						on:click={() => AppwriteService.signOut()}
						class="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center space-x-2"
					>
						<span>Logout</span>
					</button>
				{/if}
			</div>
		</header>

		<slot />
		<footer class="mt-4 text-center text-sm mb-4 text-gray-400">
			Made with 💝 and <a target="_blank" href="https://appwrite.io/" rel="noreferrer" class="underline">Appwrite</a>. Contact: <span class="underline">matejbaco2000@gmail.com</span>
		</footer>
	{/if}
</div>
