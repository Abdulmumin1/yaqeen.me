<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { copyUrlToClipboard } from '$lib/js/utils.js';

	const links = {
		github: 'https://github.com/Abdulmumin1',
		linkedin: 'https://linkedin.com/in/abdulmuminyqn',
		twitter: 'https://twitter.com/abdulmuminyqn',
		youtube: 'https://youtube.com/@abdulmuminyqn',
		hashnode: 'https://avdurr.hashnode.dev'
	};

	const emailAddress = 'abdulmuminyqn@gmail.com';

	let copiedEmail = $state(false);
	let resetTimer = $state(null);

	function copyEmailAddress() {
		copyUrlToClipboard(emailAddress);
		copiedEmail = true;

		if (resetTimer) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copiedEmail = false;
		}, 2000);
	}
</script>

<footer class="w-full py-6 px-6 flex flex-col gap-3 text-xs opacity-60">
	<div class="max-w-2xl mx-auto w-full flex flex-col gap-3">
		<div class="flex gap-3">
			<a href={links.github} class="hover:opacity-100 transition-opacity">
				<Fa icon={faGithub} />
			</a>
			<a href={links.linkedin} class="hover:opacity-100 transition-opacity">
				<Fa icon={faLinkedin} />
			</a>
			<a href={links.twitter} class="hover:opacity-100 transition-opacity">
				<Fa icon={faTwitter} />
			</a>
			<a href={links.youtube} class="hover:opacity-100 transition-opacity">
				<Fa icon={faYoutube} />
			</a>
		</div>

		<div class="flex flex-col gap-1">
			<button
				type="button"
				onclick={copyEmailAddress}
				class="w-fit text-left hover:text-primary transition-colors"
				aria-label="Copy email address"
			>
				{copiedEmail ? 'email copied' : 'copy email'}
			</button>
		</div>

		<div class="flex gap-2 text-[10px]">
			<a href={links.hashnode} class="hover:opacity-100 transition-opacity">blog</a>
			<span>/</span>
			<a href={links.linkedin} class="hover:opacity-100 transition-opacity">linkedin</a>
			<span>/</span>
			<a href={resolve('/wallpapers')} class="hover:opacity-100 transition-opacity">wallpapers</a>
		</div>
	</div>
</footer>
