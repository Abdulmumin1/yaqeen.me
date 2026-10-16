<script>
	import { scale } from 'svelte/transition';
	import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import NotFound from '$components/general/notFound.svelte';
</script>

{#if page.status === 404}
	<NotFound />
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div
			in:scale={{ duration: 300, start: 0.95 }}
			class="w-full max-w-lg p-8 rounded-2xl border-primary/30 bg-surface-muted text-text-main"
		>
			<h1 class="text-4xl font-bold mb-4 text-primary">Error {page.status}</h1>
			<p class="text-text-muted mb-6">{page.error?.message}</p>

			<div class="flex space-x-4">
				<a
					href={resolve('/')}
					class="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
				>
					<Fa icon={faHome} />
					<span>Go Home</span>
				</a>
				<button
					type="button"
					onclick={() => history.back()}
					class="flex items-center space-x-2 bg-surface-muted hover:bg-surface-soft text-text-main font-bold py-2 px-4 rounded-lg transition duration-300"
				>
					<Fa icon={faArrowLeft} />
					<span>Go Back</span>
				</button>
			</div>
		</div>
	</div>
{/if}
