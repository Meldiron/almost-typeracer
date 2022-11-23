<script>
	import '../app.css';
</script>

<div class="mx-auto max-w-4xl">
		<header
			class="my-6 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between space-x-3"
		>
			<a href="/" class="text-2xl font-bold text-slate-900">Almost TypeRacer</a>
			<div>
			</div>
		</header>
		<slot />
		<footer class="mt-4 text-center text-sm mb-4 text-gray-400">
			Made with 💝 and <a target="_blank" href="https://appwrite.io/" rel="noreferrer" class="underline">Appwrite</a>. Contact: <span class="underline">matejbaco2000@gmail.com</span>
		</footer>
</div>