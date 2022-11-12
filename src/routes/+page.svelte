<script lang="ts">
	const days: any = [];

	// Add offset
	days.push(null);

	for (let i = 1; i <= 30; i++) {
		days.push({
            i,
            green: Math.random() > 0.3,
            pink: Math.random() > 0.5,
            blue: Math.random() > 0.8,
        });
	}
</script>

<section class="my-6 bg-white rounded-lg shadow-sm p-4">
	<div class="w-full grid grid-cols-7 gap-4">
		<div class="col-span-1 text-center font-bold text-gray-300">M</div>
		<div class="col-span-1 text-center font-bold text-gray-300">T</div>
		<div class="col-span-1 text-center font-bold text-gray-300">W</div>
		<div class="col-span-1 text-center font-bold text-gray-300">TH</div>
		<div class="col-span-1 text-center font-bold text-gray-300">F</div>
		<div class="col-span-1 text-center font-bold text-gray-300">S</div>
		<div class="col-span-1 text-center font-bold text-gray-300">S</div>

		{#each days as day}
			<div class="col-span-1 flex items-center justify-center max-h-[100px]">
				{#if day !== null}
					<svg
						width="224"
						height="224"
						viewBox="0 0 224 224"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="112" cy="112" r="112" fill="currentColor" class="text-gray-100" />
						{#if day.green}
                        <path
                        d="M127 16.1668C138.756 18.0069 150.116 22.0013 160.496 27.993C175.24 36.5049 187.485 48.7477 195.999 63.4912C204.514 78.2347 208.997 94.9594 209 111.985C209.002 123.969 206.783 135.806 202.501 146.907L127 103.338V16.1668Z"
                        stroke="#A3E635"
                        stroke-width="30"
                    />
                    <mask id="path-3-inside-1_2_45" fill="white">
                        <path
                            d="M208.995 168C199.166 185.024 185.029 199.162 168.005 208.992C150.981 218.822 131.67 223.998 112.012 224C92.3536 224.002 73.0412 218.83 56.0153 209.004C38.9893 199.177 24.8495 185.043 15.0169 168.02L112 112L208.995 168Z"
                        />
                    </mask>
                        {/if}
						{#if day.pink}
                        <path
                        d="M208.995 168C199.166 185.024 185.029 199.162 168.005 208.992C150.981 218.822 131.67 223.998 112.012 224C92.3536 224.002 73.0412 218.83 56.0153 209.004C38.9893 199.177 24.8495 185.043 15.0169 168.02L112 112L208.995 168Z"
                        stroke="#F472B6"
                        stroke-width="60"
                        mask="url(#path-3-inside-1_2_45)"
                    />
                    <mask id="path-4-inside-2_2_45" fill="white">
                        <path
                            d="M15.0052 168C5.1761 150.976 0.00103189 131.664 1.54255e-07 112.006C-0.00103158 92.3478 5.17201 73.0356 14.9993 56.0102C24.8266 38.9847 38.9619 24.8457 55.9847 15.014C73.0076 5.18223 92.3184 0.00412667 111.977 2.46481e-06L112 112L15.0052 168Z"
                        />
                    </mask>
                        {/if}
						{#if day.blue}
                        <path
							d="M15.0052 168C5.1761 150.976 0.00103189 131.664 1.54255e-07 112.006C-0.00103158 92.3478 5.17201 73.0356 14.9993 56.0102C24.8266 38.9847 38.9619 24.8457 55.9847 15.014C73.0076 5.18223 92.3184 0.00412667 111.977 2.46481e-06L112 112L15.0052 168Z"
							stroke="#38BDF8"
							stroke-width="60"
							mask="url(#path-4-inside-2_2_45)"
						/>
                        {/if}
						<circle cx="112" cy="112" r="83" fill="currentColor" class="text-white" />
						<text font-size="64" dominant-baseline="middle" text-anchor="middle" alignment-baseline="central" fill="currentColor" class="text-gray-900 font-bold" x="112" y="112">{day.i}</text>
					</svg>
				{/if}
			</div>
		{/each}
	</div>
</section>
