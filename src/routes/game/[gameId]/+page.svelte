<script lang="ts">
	const text = `add: self
{
  $this->balancers[] = $balancer;
  return $this;
}`;

	const letters = text.split('');

	let input = '';

	let inputPass = 0;
	let inputFail = 0;

	$: if (input !== null) {
		inputPass = 0;

		let index = 0;
		let didOneFail = false;

		for (const letter of input.split('')) {
			const expectedLetter = letters[index] ?? null;

			if (expectedLetter === letter && !didOneFail) {
				inputPass++;
			} else {
				didOneFail = true;
				inputFail++;
			}

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

	function onInputChange(event: any) {
		console.log(event);
	}
</script>

<section class="my-6 bg-white rounded-lg shadow-sm p-4">
	<div class="flex items-center justify-center space-x-3 pb-8 pt-4">
		<h3 class="text-gray-900 font-bold text-xl">SOME DATE</h3>
	</div>
	<div class="w-full">
		<div class="p-6 rounded-xl bg-[#1e1e1e] text-[#669bd1]">
			{#key inputPass}
				{#key inputFail}
					{#each letters as letter, index}
						{#if letter == '\n'}
							<span class={`px-0.5 text-gray-500 ${getLetterClasses(index, true)}`}>×</span><br />
						{:else if letter == ' '}
							<span class={`px-0.5 text-gray-500 ${getLetterClasses(index, true)}`}>•</span>
						{:else}
							<span class={getLetterClasses(index, false)}>{letter}</span>
						{/if}
					{/each}
				{/key}
			{/key}
		</div>
	</div>
	<div class="w-full mt-4">
		<textarea
			rows="3"
			bind:value={input}
			class="w-full rounded-xl border-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 p-3"
			type="text"
			placeholder="Click here and start typing ..."
		/>
	</div>
</section>
