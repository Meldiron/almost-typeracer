<script lang="ts">
    export let letter: string;
    export let classes: string;
</script>

{#if letter == '\n'}
<span class={`px-0.5 text-gray-500 ${classes}`}>×</span><br />
{:else if letter == ' '}
<span class={`px-0.5 text-gray-500 ${classes}`}>•</span>
{:else}
<span class={classes}>{letter}</span>
{/if}