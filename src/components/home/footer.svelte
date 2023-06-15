<script>
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import {mylinks } from '../utils/randomstore.js'
</script>

<footer
	class="bottom-0 bg-orange-600 dark:bg-orange-700 dark:text-black border-t-2 border-black w-full p-6 items-center justify-center flex flex-col s"
>
	<p class="">abdulmumin.com</p>
	<div class="flex space-x-2">
		<a href="{$mylinks.github}">

			<Fa icon={faGithub} />
		</a>
		<a href="{$mylinks.linkedin}">

			<Fa icon={faLinkedin} />
		</a>
		<a href="{$mylinks.twitter}">
			<Fa icon={faTwitter} />

		</a>
		<a href="{$mylinks.youtube}">

			<Fa icon={faYoutube} />
		</a>
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
		<a href="{$mylinks.hashnode}">Blog</a>
		<p>|</p>
		<a href="{$mylinks.linkedin}">LinkedIn</a>
		<p>|</p>
		<a href="{$mylinks.hashnode}">Resources</a>
		<p>|</p>
		<a href="#">Wallpapers</a>
	</div>
</footer>
