<script lang="ts">
	import { AppwriteService } from '$lib/appwrite';
	import { afterUpdate, beforeUpdate, tick } from 'svelte';
	import Letter from './letter.svelte';

	/*
	let t = 0;
	beforeUpdate(() => {
		t = Date.now();
	});

	afterUpdate(() => {
		console.log(Date.now() - t);
	});
	*/

	export let data: { gameId: string };

	let backendData = fetchBackendData();

	async function fetchBackendData() {
		const res = await AppwriteService.getDailyMap(data.gameId);
		text = res.text;
		letters = text.split('').map((l) => {
			return {
				letter: l,
				id: Math.random().toString(16).slice(2),
				classes: []
			};
		});
		return res;
	}

	let gameEnded = false;
	let gameSubmitting = false;

	let timerStart: number | null = null;
	let timerNow: number | null = null;

	let mistakes = 0;

	let text = ``;
	let letters: any = [];

	let inputPass = 0;
	let inputFail = 0;

	function onKeyPress(e: any) {
		const inputLetter = e.data;
		let input = e.target.value;
		const isSpace = inputLetter === ' ';

		if (timerStart === null) {
			timerStart = Date.now();
		}

		const oldinputFail = inputFail;

		inputPass = 0;
		inputFail = 0;

		let index = 0;
		let didOneFail = false;

		for (const letter of input.split('')) {
			const expectedLetter = letters[index].letter ?? null;

			if (expectedLetter === letter && !didOneFail) {
				inputPass++;
			} else {
				didOneFail = true;
				inputFail++;
			}

			index++;
		}

		if (isSpace && !didOneFail) {
			while (letters[index].letter === ' ') {
				inputPass++;
				index++;
				input += ' ';
			}
		}

		e.target.value = input;

		if (oldinputFail < inputFail) {
			mistakes += inputFail - oldinputFail;
		}

		timerNow = Date.now();

		if (inputFail === 0 && inputPass === letters.length) {
			endGame();
		}

		index = 0;
		for(const letter of letters) {
			const isBackground = letter.letter == ' ' || letter.letter == '\n';
			letters[index].classes = getLetterClasses(index, isBackground);
			index++;
		}
	}

	function getLetterClasses(index: number, isBackground: boolean): string {
		if (index < inputPass) {
			return isBackground ? '!text-[#a9dbfa]' : 'text-[#a9dbfa] font-bold';
		} else if (index < inputPass + inputFail) {
			return isBackground ? 'bg-[#c13227] !text-[#c13227] font-bold' : 'text-[#c13227] font-bold';
		}
		return '';
	}

	let endGamePromise: Promise<any> | null = null;

	async function endGame() {
		endGamePromise = AppwriteService.submitGame(
			data.gameId,
			calculateWPM(timerStart, timerNow),
			mistakes
		);
		gameEnded = true;
		gameSubmitting = true;
	}

	function calculateWPM(start: number | null, now: number | null) {
		if (!start || !now) {
			return 0;
		}

		const dif = now - start;
		const difSecs = dif / 1000;

		const lettersCount = inputPass;
		const wordCount = lettersCount / 4.7;

		const wpm = (wordCount / difSecs) * 60;
		return Math.round(wpm);
	}

	function parseHtml(text: string) {
		return text
			.split('\n')
			.join('<span{{ATR_SPACE}}class="px-0.5">×</span><br>')
			.split(' ')
			.join('<span{{ATR_SPACE}}class="px-0.5">•</span>')
			.split('{{ATR_SPACE}}')
			.join(' ');
	}
</script>

<section class="my-6 bg-white rounded-lg shadow-sm p-4">
	{#await backendData}
		<div class="col-span-1 md:col-span-7 flex items-center justify-center">
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
		</div>
	{:then day}
		<div class="flex items-center justify-center space-x-3 pb-8 pt-4">
			<h3 class="text-gray-900 font-bold text-xl">
				{new Date(day.date).toLocaleString(undefined, {
					day: 'numeric',
					month: 'short',
					year: 'numeric'
				})}
			</h3>
		</div>
		<div class="w-full">
			<div class="text-sm rounded-xl bg-[#1e1e1e] text-[#669bd1] overflow-x-auto">
				{#if day.textBefore}
					<div class="text-sm bg-black text-gray-700 rounded-t-xl px-6 pt-4 pb-2">
						{@html parseHtml(day.textBefore)}
					</div>
				{/if}
				<div class="px-6 my-2">
					{#each letters as letter (letter.id)}
						<Letter letter={letter.letter} classes={letter.classes} />
					{/each}
				</div>
				{#if day.textAfter}
					<div class="text-sm bg-black text-gray-600 rounded-b-xl px-6 pt-2 pb-4">
						{@html parseHtml(day.textAfter)}
					</div>
				{/if}
			</div>
		</div>
		<div class="w-full mt-4">
			<textarea
				on:input={onKeyPress}
				rows="3"
				disabled={gameEnded}
				class="disabled:opacity-50 w-full rounded-xl border-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 p-3"
				type="text"
				placeholder="Click here and start typing ..."
			/>

			<hr class="border-t-2 border-gray-100 my-4" />

			<div class="grid grid-cols-12 gap-4">
				<div class="col-span-12 md:col-span-6 text-green-700 bg-green-200 rounded-xl p-4">
					<b class="font-bold text-xl">{calculateWPM(timerStart, timerNow)}</b> WPM
				</div>
				<div class="col-span-12 md:col-span-6 text-red-700 bg-red-200 rounded-xl p-4">
					<b class="font-bold text-xl">{mistakes}</b>
					{mistakes === 1 ? 'Mistake' : 'Mistakes'}
				</div>
			</div>

			{#if endGamePromise !== null}
				<hr class="border-t-2 border-gray-100 my-4" />
				{#await endGamePromise}
					<div class="flex justify-center">
						<svg
							class="animate-spin h-6 w-6 text-slate-900"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
				{:then response}
					<div class="flex justify-center">
						<p class="font-bold text-green-500">{response.message}</p>
					</div>
				{:catch error}
					<div class="flex justify-center">
						<p class="font-bold text-orange-500">{error.message}</p>
					</div>
				{/await}
			{/if}
		</div>
	{:catch error}
		<div class="col-span-1 md:col-span-7 flex items-center justify-center">
			<p class="font-bold text-orange-500">{error.message}</p>
		</div>
	{/await}
</section>
