<script>
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { mylinks } from '$lib/utils/randomstore.js';
</script>

<footer class="w-full py-6 px-6 flex flex-col gap-3 text-xs opacity-60">
	<div class="max-w-2xl mx-auto w-full flex flex-col gap-3">
		<div class="flex gap-3">
			<a href={$mylinks.github} class="hover:opacity-100 transition-opacity">
				<Fa icon={faGithub} />
			</a>
			<a href={$mylinks.linkedin} class="hover:opacity-100 transition-opacity">
				<Fa icon={faLinkedin} />
			</a>
			<a href={$mylinks.twitter} class="hover:opacity-100 transition-opacity">
				<Fa icon={faTwitter} />
			</a>
			<a href={$mylinks.youtube} class="hover:opacity-100 transition-opacity">
				<Fa icon={faYoutube} />
			</a>
		</div>

		<div class="flex flex-col gap-1">
			<a
				href="mailto:abdulmuminyqn@gmail.com"
				class="hover:text-primary hover:text-primary transition-colors"
			>
				abdulmuminyqn@gmail.com
			</a>
		</div>

		<div class="flex gap-2 text-[10px]">
			<a href={$mylinks.hashnode} class="hover:opacity-100 transition-opacity">blog</a>
			<span>/</span>
			<a href={$mylinks.linkedin} class="hover:opacity-100 transition-opacity">linkedin</a>
			<span>/</span>
			<a href="/wallpapers" class="hover:opacity-100 transition-opacity">wallpapers</a>
		</div>
	</div>
</footer>
