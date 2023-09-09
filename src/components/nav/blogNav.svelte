<script>
	import { slide } from 'svelte/transition';

	import Fa from 'svelte-fa';
	import { faRss } from '@fortawesome/free-solid-svg-icons';
</script>

<ul
	transition:slide
	class="w-full flex justify-between py-6 px-3 z-50 fixed bg-orange-100 items-center mt-12 border-b-2 border-orang dark:border-dark dark:bg-stone-900"
>
	<li>
		<a href="/blog" class="font-bold">yaqeen.me</a>
	</li>
	<li>
		<ul class="flex gap-2">
			<a href="/about">About</a>
			<div class="w-full flex items-center justify-center gap-2">
				<!-- <input
                    value="search - alpha"
                    class="bg-inherit border p-2 border-b-2 rounded-xl border-orang dark:border-dark"
                /> -->
				<Fa icon={faRss} />
				<a href="/rss.xml"> RSS</a>
			</div>
		</ul>
	</li>
</ul>
