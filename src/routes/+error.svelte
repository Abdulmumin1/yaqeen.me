<!-- <script>
</script>

<div class="h-screen flex items-center justify-center">
	<h1>{page.status}: {page.error?.message}</h1>
</div> -->

<script>
	import { scale } from 'svelte/transition';
	import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { page } from '$app/state';
	let status = page.status;
	let error = page.error;
</script>

<div class="flex items-center justify-center min-h-screen">
	<div
		in:scale={{ duration: 300, start: 0.95 }}
		class="w-full max-w-lg p-8 rounded-2xl border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-stone-800 text-stone-900 dark:text-orange-100"
	>
		<h1 class="text-4xl font-bold mb-4 text-orange-500 dark:text-orange-300">Error {status}</h1>
		<p class="text-stone-700 dark:text-orange-200 mb-6">{error.message}</p>

		<div class="flex space-x-4">
			<a
				href="/"
				class="flex items-center space-x-2 bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600 text-stone-900 dark:text-orange-100 font-bold py-2 px-4 rounded-lg transition duration-300"
			>
				<Fa icon={faHome} />
				<span>Go Home</span>
			</a>
			<button
				onclick={() => history.back()}
				class="flex items-center space-x-2 bg-orange-200 dark:bg-stone-700 hover:bg-orange-300 dark:hover:bg-stone-600 text-stone-800 dark:text-orange-100 font-bold py-2 px-4 rounded-lg transition duration-300"
			>
				<Fa icon={faArrowLeft} />
				<span>Go Back</span>
			</button>
		</div>
	</div>
</div>
