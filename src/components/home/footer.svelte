<script>
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
</script>

<footer
	class="bottom-0 bg-orange-500 dark:text-black border-t-2 border-black w-full p-6 items-center justify-center flex flex-col s"
>
	<p class="">abdulmumin.com</p>
	<div class="flex space-x-2">
		<Fa icon={faGithub} />
		<Fa icon={faLinkedin} />
		<Fa icon={faTwitter} />
		<Fa icon={faYoutube} />
	</div>
	<div>
		<p>Gigs, or Need help? Email</p>
		<a
			href="mailto:hello@abdulmumin.com?subject=Hi%20Abdulmumin&body=Just%20saying%20hi!"
			class="font-visby font-bold"
			target="_blank">hello@abdulmumin.com</a
		>
	</div>
	<p class="font-visby_bold font-bold text-2xl">Helpful links</p>

	<div class="flex space-x-2 flex-wrap">
		<a href="#">Blog</a>
		<p>|</p>
		<a href="#">LinkedIn</a>
		<p>|</p>
		<a href="#">Resources</a>
		<p>|</p>
		<a href="#">Wallpapers</a>
	</div>
</footer>
