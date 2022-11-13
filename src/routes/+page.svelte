<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppwriteService, launchDate } from '$lib/appwrite';

	let month = new Date();
	month.setDate(1);

	let backendData = fetchBackendData();

	let monthOffset = 0;
	let monthDays = 0;
	$: monthName = month.toLocaleString('default', { month: 'long' });
	$: if (month) {
		const dateOfWeek = month.getDay();
		monthOffset = dateOfWeek === 0 ? 6 : dateOfWeek - 1;

		const lastDayDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
		monthDays = lastDayDate.getDate();

		backendData = fetchBackendData();
	}

	function onPlayGame(dayId: string | null, isPlayable: boolean) {
		if(dayId === null && isPlayable) {
			alert("Only VIP players can play this daily map.");
			return;
		}

		if(dayId === null) {
			alert("You cannot play daily map in future.");
			return;
		}

		goto('/game/' + dayId);
	}

	async function fetchBackendData() {
		const days = await AppwriteService.getDailyMaps(month.getFullYear(), month.getMonth());
		const profiles = await AppwriteService.getDailyMapProfiles(
			days.documents.map((doc) => doc.$id)
		);

		return { days, profiles };
	}

	function switchMonth(amount: number) {
		month.setMonth(month.getMonth() + amount);
		month.setDate(1);
		month = month;
	}

	const days: any = [];

	// Add offset
	days.push(null);

	for (let i = 1; i <= 30; i++) {
		days.push({
			i,
			green: Math.random() > 0.3,
			pink: Math.random() > 0.5,
			blue: Math.random() > 0.8
		});
	}
</script>

<section class="my-6 bg-white rounded-lg shadow-sm p-4">
	<div class="flex items-center justify-between space-x-3 pb-8 pt-4">
		<button on:click={() => switchMonth(-1)} class="text-gray-600 hover:text-gray-900">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</button>

		<h3 class="text-gray-900 font-bold text-xl">{monthName} {month.getFullYear()}</h3>
		<button on:click={() => switchMonth(1)} class="text-gray-600 hover:text-gray-900">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
			</svg>
		</button>
	</div>
	<div class="w-full grid grid-cols-1 md:grid-cols-7 gap-4">
		<div class="col-span-1 text-center font-bold text-gray-300">M</div>
		<div class="col-span-1 text-center font-bold text-gray-300">T</div>
		<div class="col-span-1 text-center font-bold text-gray-300">W</div>
		<div class="col-span-1 text-center font-bold text-gray-300">TH</div>
		<div class="col-span-1 text-center font-bold text-gray-300">F</div>
		<div class="col-span-1 text-center font-bold text-gray-300">S</div>
		<div class="col-span-1 text-center font-bold text-gray-300">S</div>

		{#each Array.from(Array(monthOffset).keys()) as _offsetIndex}
			<div class="col-span-1 flex items-center justify-center" />
		{/each}

		{#await backendData}
			<div class="col-span-1 md:col-span-7 flex items-center justify-center">
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
		{:then { days, profiles }}
			{#each Array.from(Array(monthDays).keys())
				.map((dayIndex) => {
					const backendDay = days.documents.find((doc) => new Date(doc.date).getDate() - 1 === dayIndex);
					return backendDay === undefined ? dayIndex : backendDay;
				})
				.map((backendDay) => {
					if (typeof backendDay === 'number') {
						const dayDate = new Date(month.getFullYear(), month.getMonth(), backendDay + 1);
						
						return { isPlayable: dayDate < new Date() && dayDate >= launchDate, dayId: null, dayNumber: backendDay + 1, isFinished: false, isNoMistake: false, isFastFinish: false };
					}

					const dayProfile = profiles.documents.find((doc) => doc.dailyMapId === backendDay.$id);

					const dayDate = new Date(backendDay.date);

					return { isPlayable: dayDate < new Date() && dayDate >= launchDate, dayId: backendDay.$id, dayNumber: new Date(backendDay.date).getDate(), isFinished: dayProfile?.medalFinish ?? false, isNoMistake: dayProfile?.medalNoMistake ?? false, isFastFinish: dayProfile?.medalFastFinish ?? false };
				}) as day}
				<button on:click={() => onPlayGame(day.dayId, day.isPlayable)} class="col-span-1 flex items-center justify-center relative">
					{#if day.dayId === null && day.isPlayable}
						<div class="absolute top-1.5 left-0 w-full flex justify-center">
							<div class="transform translate-y-[-50%] bg-emerald-200 bg-opacity-100 rounded-full flex items-center justify-center p-1.5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4 text-emerald-700">
									<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
								  </svg>
							</div>
							
							  
						</div>
					{/if}
					<svg
						width="224"
						height="224"
						class="h-[auto]"
						viewBox="0 0 224 224"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="112" cy="112" r="112" fill="currentColor" class="text-gray-100" />
						{#if day.isFastFinish}
							<path
								d="M127 16.1668C138.756 18.0069 150.116 22.0013 160.496 27.993C175.24 36.5049 187.485 48.7477 195.999 63.4912C204.514 78.2347 208.997 94.9594 209 111.985C209.002 123.969 206.783 135.806 202.501 146.907L127 103.338V16.1668Z"
								stroke="#A3E635"
								stroke-width="30"
							/>
						{/if}

						<mask id="path-3-inside-1_2_45" fill="white">
							<path
								d="M208.995 168C199.166 185.024 185.029 199.162 168.005 208.992C150.981 218.822 131.67 223.998 112.012 224C92.3536 224.002 73.0412 218.83 56.0153 209.004C38.9893 199.177 24.8495 185.043 15.0169 168.02L112 112L208.995 168Z"
							/>
						</mask>
						{#if day.isNoMistake}
							<path
								d="M208.995 168C199.166 185.024 185.029 199.162 168.005 208.992C150.981 218.822 131.67 223.998 112.012 224C92.3536 224.002 73.0412 218.83 56.0153 209.004C38.9893 199.177 24.8495 185.043 15.0169 168.02L112 112L208.995 168Z"
								stroke="#F472B6"
								stroke-width="60"
								mask="url(#path-3-inside-1_2_45)"
							/>
						{/if}

						<mask id="path-4-inside-2_2_45" fill="white">
							<path
								d="M15.0052 168C5.1761 150.976 0.00103189 131.664 1.54255e-07 112.006C-0.00103158 92.3478 5.17201 73.0356 14.9993 56.0102C24.8266 38.9847 38.9619 24.8457 55.9847 15.014C73.0076 5.18223 92.3184 0.00412667 111.977 2.46481e-06L112 112L15.0052 168Z"
							/>
						</mask>
						{#if day.isFinished}
							<path
								d="M15.0052 168C5.1761 150.976 0.00103189 131.664 1.54255e-07 112.006C-0.00103158 92.3478 5.17201 73.0356 14.9993 56.0102C24.8266 38.9847 38.9619 24.8457 55.9847 15.014C73.0076 5.18223 92.3184 0.00412667 111.977 2.46481e-06L112 112L15.0052 168Z"
								stroke="#38BDF8"
								stroke-width="60"
								mask="url(#path-4-inside-2_2_45)"
							/>
						{/if}
						<circle cx="112" cy="112" r="83" fill="currentColor" class="text-white" />
						<text
							font-size="64"
							dominant-baseline="middle"
							text-anchor="middle"
							alignment-baseline="central"
							fill="currentColor"
							class={`font-bold ${day.dayId === null ? 'text-gray-200' : 'text-gray-900'}`}
							x="112"
							y="112">{day.dayNumber}</text
						>
					</svg>
				</button>
			{/each}
		{:catch error}
			<div class="col-span-1 md:col-span-7 flex items-center justify-center">
				<p class="font-bold text-orange-500">{error.message}</p>
			</div>
		{/await}
	</div>
</section>
