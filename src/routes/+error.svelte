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
		class="w-full max-w-lg p-8 rounded-2xl border-primary/30 bg-surface-muted text-text-main"
	>
		<h1 class="text-4xl font-bold mb-4 text-primary">Error {status}</h1>
		<p class="text-text-muted mb-6">{error.message}</p>

		<div class="flex space-x-4">
			<a
				href="/"
				class="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
			>
				<Fa icon={faHome} />
				<span>Go Home</span>
			</a>
			<button
				onclick={() => history.back()}
				class="flex items-center space-x-2 bg-surface-muted hover:bg-surface-soft text-text-main font-bold py-2 px-4 rounded-lg transition duration-300"
			>
				<Fa icon={faArrowLeft} />
				<span>Go Back</span>
			</button>
		</div>
	</div>
</div>
