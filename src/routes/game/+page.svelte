<script lang="ts">
	let textDailyMap = [
		...`public
         function add(Balancer $balancer): self
{
    $this->balancers[] = $balancer;
    return $this;
}`
	];
	console.log('🚀 ~ file: +page.svelte ~ line 9 ~ textDailyMap', textDailyMap);

	let textUser = [...''];
	let textErr = false;

	function textInput(event: { repeat: any; key: any; preventDefault: () => void }) {
		console.log(event.key);
		switch (event.key) {
			case 'Backspace':
				textUser = textUser.slice(0, -1);
				break;
			case 'Shift':
				break;
			case 'Tab':
				[...textUser, '    '];
				break;
			case 'Enter':
				[...textUser, '\n'];
				break;
			default:
				textUser = [...textUser, event.key];
				break;
		}
	}
	function textCeck(): boolean {
		if (textDailyMap.slice(0, textUser.length) == textUser) {
			return true;
		}
		return false;
	}
	function getLetterColor(index: number): string {
		if (index >= textUser.length) {
			return 'white';
		} else if (textDailyMap[index] != textUser[index] || textErr) {
			return 'red';
		} else if (textDailyMap[index] == textUser[index]) {
			return 'green';
		}
		return 'white';
	}
</script>

<svelte:window on:keydown={textInput} />

{#key textUser}
	{#each textDailyMap as letter, index}
		{#if letter == '\n'}
			<br />
		{:else if letter == ' '}
			<b style="background-color: {getLetterColor(index)};">&nbsp;</b>
		{:else}
			<b style="background-color: {getLetterColor(index)};">{letter}</b>
		{/if}
	{/each}
{/key}
